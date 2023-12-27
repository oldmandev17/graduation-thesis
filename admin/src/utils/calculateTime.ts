const calculateTime = (inputDateStr: any) => {
  const inputDate: any = new Date(inputDateStr)

  const currentDate: any = new Date()

  const timeFormat: any = { hour: 'numeric', minute: 'numeric' }
  const dateFormat: any = { day: '2-digit', month: '2-digit', year: 'numeric' }

  if (
    inputDate.getUTCDate() === currentDate.getUTCDate() &&
    inputDate.getUTCMonth() === currentDate.getUTCMonth() &&
    inputDate.getUTCFullYear() === currentDate.getUTCFullYear()
  ) {
    const ampmTime = inputDate.toLocaleTimeString('en-US', timeFormat)

    return ampmTime
  }
  if (
    inputDate.getUTCDate() === currentDate.getUTCDate() - 1 &&
    inputDate.getUTCMonth() === currentDate.getUTCMonth() &&
    inputDate.getUTCFullYear() === currentDate.getUTCFullYear()
  ) {
    return 'Yesterday'
  }
  if (
    Math.floor((currentDate - inputDate) / (1000 * 60 * 60 * 24)) > 1 &&
    Math.floor((currentDate - inputDate) / (1000 * 60 * 60 * 24)) <= 7
  ) {
    const timeDifference = Math.floor((currentDate - inputDate) / (1000 * 60 * 60 * 24))

    const targetDate = new Date()

    targetDate.setDate(currentDate.getDate() - timeDifference)

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    const targetDay = daysOfWeek[targetDate.getDate()]

    return targetDay
  }
  const formattedDate = inputDate.toLocaleDateString('en-GB', dateFormat)

  return formattedDate
}

export default calculateTime
