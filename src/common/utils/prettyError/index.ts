export const prettyError = (error: any) => {
  if (error.name === 'ValidationError') {
    return Object.entries(error.errors).map(([key, value]: [any, any]) => ({
      key: key,
      message: value.message,
    }))
  }

  if (error.code === 11000) {
    return Object.entries(error.keyValue).map(([key, value]: [any, any]) => ({
      key: key,
      message: `${value} already exists`,
    }))
  }

  return error
}

export default prettyError
