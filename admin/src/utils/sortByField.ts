function sortByField<T>(arr: T[], field: keyof T): T[] {
  return [...arr].sort((a, b) => {
    const fieldA = String(a[field]).toUpperCase()
    const fieldB = String(b[field]).toUpperCase()
    if (fieldA < fieldB) {
      return -1
    }
    if (fieldA > fieldB) {
      return 1
    }
    return 0
  })
}

export default sortByField
