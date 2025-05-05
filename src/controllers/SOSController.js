import express from 'express'
import SOS from '../models/SOSRequestModel.js' // adjust path if needed
// import { createSOSRequest } from '../repositories/SOSRepository.js'
import User from '../models/userModel.js'
import { createResponse } from '../utils/responseHelper.js'

// POST /api/sos
export const SOSRequest = async (req, res) => {
  try {
    const { latitude, longitude} = req.body
    const user = req.user

    console.log(user);
    

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json(
          createResponse(true, 'Latitude and longitude are required', [], '')
        )
    }

        
      const lat = parseFloat(latitude)
      const lng = parseFloat(longitude)


      if (
        isNaN(lat) ||
        isNaN(lng) ||
        Math.abs(lat) > 90 ||
        Math.abs(lng) > 180
      ) {
        return res.status(400).json({ error: 'Invalid latitude or longitude' })
      }

      const driver = await User.findOne({
        userType: 'driver',
        permanentLocation: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
            // $maxDistance: 10000, // optional, meters
          },
        },
      })

      

      
      let hospital
      if (driver) {
        hospital = await User.findOne({
          userType: 'hospital',
          permanentLocation: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [lng, lat],
              },
              // $maxDistance: 10000, // optional, meters
            },
          },
        })

        

        
        if (!driver || !driver.permanentLocation?.coordinates) {
          return res.status(404).json({ error: 'No nearby responder found' })
        }

        if (!hospital || !hospital.permanentLocation?.coordinates) {
          return res.status(404).json({ error: 'No nearby hospital found' })
        }

      }

      
      
        const [driverLng, driverLat] =
        driver.permanentLocation.coordinates

        const [hospitalLng, hospitalLat] =
        hospital.permanentLocation.coordinates

 
        
     
        const newSOS = new SOS({
          userId: user._id,
          driverId: driver._id,
          hospitalId: hospital._id,
          userLocation: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          driverLocation: {
            type: 'Point',
            coordinates: [driverLng, driverLat],
          },
          hospitalLocation: {
            type: 'Point',
            coordinates: [hospitalLng, hospitalLat],
          },

          driverPhone: driver.phone,
          userPhone: user.phone
        });
        
        await newSOS.save();
        

    

    if (newSOS) {
      return res
        .status(201)
        .json(createResponse(true, 'SOS created successfully', [newSOS], ''))
    }
  } catch (err) {

    
    return res.status(500).json(createResponse(true, 'Server error', [], ''))
  }
}

export const updateUserLocation = async (req, res) => {
  const { lng, lat } = req.body
  const user = req.user

  const updatedUser = await User.findOneAndUpdate(
    { email: user.email }, // Search by email
    {
      $set: {
        permanentLocation: {
          type: 'Point',
          coordinates: [lng, lat], // Update with new coordinates
        },
      },
    },
    { new: true } // Return the updated user
  )

  await SOS.findOneAndUpdate(
    { driverId: user._id }, // Search by email
    {
      $set: {
        permanentLocation: {
          type: 'Point',
          coordinates: [lng, lat], // Update with new coordinates
        },
      },
    }
  )

  if (!updatedUser) {
    return res.status(404).json({ message: 'User not found' })
  }

  res.status(200).json({
    message: 'Location updated successfully',
    user: updatedUser,
  })
}

export const findNearest = async (req, res) => {
  const { lat, lng } = req.query

  const latitude = parseFloat(lat)
  const longitude = parseFloat(lng)

  if (
    isNaN(latitude) ||
    isNaN(longitude) ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180
  ) {
    return res.status(400).json({ error: 'Invalid latitude or longitude' })
  }

  try {
    const nearestResponder = await User.findOne({
      userType: 'responder',
      permanentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 10000, // optional, meters
        },
      },
    })

    if (!nearestResponder || !nearestResponder.permanentLocation?.coordinates) {
      return res.status(404).json({ error: 'No nearby responder found' })
    }

    const [responderLng, responderLat] =
      nearestResponder.permanentLocation.coordinates

    return res.json({
      latitude: responderLat,
      longitude: responderLng,
      email: nearestResponder.email,
    })
  } catch (err) {
    console.error('Error finding nearest responder:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}


export const getDriverAssignment = async (req, res) => {
  const driverId = req.user._id;

  try {


    const assignment = await SOS.findOne({
      driverId,
      status: 'active'
    })
    .sort({ createdAt: -1 }) // latest
    .populate('userId', 'name phone address'); // populate name, phone, address from user

    if (!assignment) {
      return res.status(200).json({
        success: true,
        message: 'No assignment found',
        assigned: false,
      });
    }

    const driver = await User.findById(driverId).select('phone');  // Query the User model by driverId and select only the phone field


    const { userLocation, userId, hospitalLocation } = assignment;

    res.status(200).json({
      success: true,
      message: 'Assignment found',
      assigned: true,
      lat: userLocation.coordinates[1],
      lng: userLocation.coordinates[0],
      hospitalLat: hospitalLocation.coordinates[1],
      hospitalLng: hospitalLocation.coordinates[0],
      phone: driver.phone,
     

    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      errors: error.message,
    });
  }
};

export const getActiveSOSRequest = async (req, res) => {
  const userId = req.user._id;

  try {
    const existingRequest = await SOS.findOne({
      userId: userId,
      status: 'active',
    }).populate({
      path: 'driverId',
      select: 'phone', // Only fetch the phone number
    });

    if (!existingRequest) {
      return res
        .status(404)
        .json(createResponse(false, 'No active SOS request found', [], ''));
    }

    return res
      .status(200)
      .json(createResponse(true, 'success', [existingRequest], ''));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(createResponse(false, 'Server error', [], ''));
  }
};

export const getUsersByHospital = async (req, res) => {
  try {
    const hospitalId = req.params.hospitalId; // e.g., /api/v1/hospital/:hospitalId/users

    if (!hospitalId) {
      return res.status(400).json({ message: 'Hospital ID is required' });
    }

    // Find SOS records linked to the hospital
    const sosRecords = await SOS.find({
      hospitalId: hospitalId,
      status: 'active', // only active
    })
      .populate('userId', 'name phone address') // get specific fields from User
      .select('userId userLocation hospitalLocation');

    // Format data
    const users = sosRecords.map((record) => ({
      name: record.userId.name,
      phone: record.userId.phone,
      address: record.userId.address,
      userLocation: record.userLocation?.coordinates || [],
      hospitalLocation: record.hospitalLocation?.coordinates || [],
    }));

    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users by hospital:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};