import i18n from 'i18next'

export const prettyError = (error: any) => {
  // mongoose validation
  if (error.name === 'ValidationError') {
    const records: Record<string, string> = {}

    for (const entry of Object.entries(error.errors)) {
      const [key, value]: [any, any] = entry
      records[key] = value.message
    }

    return records
  }

  // unique value in the database
  if (error.code === 11000) {
    const records: Record<string, string> = {}

    for (const entry of Object.entries(error.keyValue)) {
      const [key, value]: [any, any] = entry
      records[key] = i18n.t('common.utils.prettyError.index.message', { value: value })
    }

    return records
  }

  return error
}

export default prettyError
