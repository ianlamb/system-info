export function capitalize(s) {
  return s.split(' ').reduce((prev, curr) => {
    return `${prev} ${curr[0].toUpperCase()}${curr.slice(1, curr.length)}`
  }, '')
}

export function getSystemTime() {
  const now = new Date()
  const hours = `${now.getHours()}`.padStart(2, '0')
  const minutes = `${now.getMinutes()}`.padStart(2, '0')
  const seconds = `${now.getSeconds()}`.padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}
