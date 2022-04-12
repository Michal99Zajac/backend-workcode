export const prettyError = (error: any) => {
  if (error.name === 'ValidationError') {
    const records: Record<string, string> = {}

    for (const entry of Object.entries(error.errors)) {
      const [key, value]: [any, any] = entry
      records[key] = value.message
    }

    return records
  }

  if (error.code === 11000) {
    const records: Record<string, string> = {}

    for (const entry of Object.entries(error.keyValue)) {
      const [key, value]: [any, any] = entry
      records[key] = `${value} already exists`
    }

    return records
  }

  return error
}

export default prettyError
