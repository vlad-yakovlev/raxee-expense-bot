export const extractObjectId = (text = '') => {
  return text?.match(/\[([0-9a-fA-F]{24})\]$/)?.[1]
}
