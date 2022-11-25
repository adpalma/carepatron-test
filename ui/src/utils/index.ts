export const toCamelCase = (text: string) => {
  return text.trim().split(' ').map(t => t[0].toUpperCase() + t.substring(1).toLowerCase())
}