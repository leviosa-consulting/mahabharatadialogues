/* Shared event shape and date formatting.

   These lived in three places before: UpcomingEventsClient and EventsClient each
   carried a byte-identical formatEventDateTime, UpcomingEventsServer had a third
   copy of parseDate, and the Event interface was declared separately in all three.
   FeaturedEventCard is rendered by two of them, so the helpers had to come here. */

export interface Event {
  id: string
  type: 'event' | 'retreat'
  title: string
  coverImage: string
  date: string
  time: string
  venue: string
  mapUrl: string
  description: string
  bookingUrl?: string
  slug?: string
  endDate?: string
  city?: string
  gallery?: string[]
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

/* Retreats store dates as "12 Apr 2026"; events store ISO strings. */
export const parseDate = (dateStr: string): Date => {
  if (dateStr.includes('-')) {
    return new Date(dateStr)
  }

  const [day, month, year] = dateStr.split(' ')
  const monthMap: { [key: string]: number } = Object.fromEntries(
    MONTHS.map((m, i) => [m, i]),
  )
  return new Date(parseInt(year), monthMap[month], parseInt(day))
}

export const formatDate = (dateStr: string): string => {
  const date = parseDate(dateStr)
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate)
  const end = new Date(endDate)

  const startDayName = WEEKDAYS[start.getDay()]
  const endDayName = WEEKDAYS[end.getDay()]

  const startMonth = MONTHS[start.getMonth()]
  const endMonth = MONTHS[end.getMonth()]
  const year = start.getFullYear()

  return `${startDayName}, ${start.getDate()} ${startMonth} - ${endDayName}, ${end.getDate()} ${endMonth} ${year}`
}

export const formatEventDateTime = (dateTimeStr: string): string => {
  const date = new Date(dateTimeStr)

  const dayName = WEEKDAYS[date.getDay()]
  const month = MONTHS[date.getMonth()]

  let hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12
  hours = hours ? hours : 12

  const timeStr = `${hours}${
    minutes > 0 ? ':' + minutes.toString().padStart(2, '0') : ''
  }${ampm}`

  return `${dayName}, ${date.getDate()} ${month} ${date.getFullYear()} | ${timeStr}`
}

export const formatPastEventDate = (dateTimeStr: string): string => {
  const date = new Date(dateTimeStr)
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

export const getDisplayDate = (item: Event): string => {
  if (item.type === 'retreat' && item.endDate && item.endDate !== item.date) {
    return formatDateRange(item.date, item.endDate)
  } else if (item.type === 'event') {
    return formatEventDateTime(item.date)
  }
  return formatDate(item.date)
}
