export const createResponse = (
  success,
  message,
  data = null,
  errors = null
) => {
  return {
    success, // true or false
    message, // any message you want to send back
    data, // actual response data
    errors, // array of errors (if any)
  }
}
