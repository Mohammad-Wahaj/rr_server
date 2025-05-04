import SOS from "../models/SOSRequestModel"

export const createSOSRequest = async (
  latitude,
  longitude,

) => {
  const newSOS = new SOS({
    userId: req.user.id, // from verifyToken middleware
    location: {
      type: 'Point',
      coordinates: [longitude, latitude], // Update with new coordinates
    },
    responder,
    notes,
  })

  const savedSOS = await newSOS.save()

  return savedSOS
}
