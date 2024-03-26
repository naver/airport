// Source: dayjs timezone plugin, https://github.com/iamkun/dayjs/blob/dev/src/plugin/timezone/index.js
import { ConfigType, OpUnitType, PluginFunc, Dayjs, DayjsTimezone } from "dayjs"
import { TimezoneDataMap, TimezoneType } from "../../types"

export const MS = 'millisecond'
export const MIN = 'minute'

const typeToPos = {
  year: 0,
  month: 1,
  day: 2,
  hour: 3,
  minute: 4,
  second: 5
}

export interface DtfCache {
  [timezonekey: string]: Intl.DateTimeFormat
}

interface DtfCacheOption {
  timeZoneName?: 'short' | 'long'
}

interface DateTimeFormatPart extends Intl.DateTimeFormatPart {
  type: Exclude<Intl.DateTimeFormatPartTypes, 'dayPeriod' | 'era' | 'literal' | 'timeZoneName' | 'weekday'>;
  value: string;
}

const dtfCacheForOffset: DtfCache = {}
const getDateTimeFormatForOffset = (timezone: TimezoneType, options: DtfCacheOption = {}) => {
  const timeZoneName = options.timeZoneName || 'short'
  const key = `${timezone}|${timeZoneName}`
  let dtf = dtfCacheForOffset[key]
  if (!dtf) {
    dtf = new Intl.DateTimeFormat('en-US', {
      hour12: false,
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName
    })
    dtfCacheForOffset[key] = dtf
  }
  return dtf
}

// Dayjs.prototype.tz 성능 향상을 위해 캐싱 구현
const dtfCache: DtfCache = {}

// 캐시 갱신
const setDateTimeFormat = (timezone: TimezoneType) => {
  dtfCache[timezone] = new Intl.DateTimeFormat('en-US', {
    hour12: true,
    timeZone: timezone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  })
}

const getDateTimeFormat = (timezone: TimezoneType) => {
  if (!dtfCache[timezone]) {
    setDateTimeFormat(timezone)
  }
  return dtfCache[timezone]
}

let timezoneDataMap: TimezoneDataMap = {}

const customTimezonePlugin: PluginFunc = (o, c, d) => {
  let defaultTimezone: TimezoneType

  function getTargetOffset(date: Date, timezone: string) {
    const timezoneData = timezoneDataMap[timezone]

    if (typeof timezoneData === 'number') {
      return timezoneData
    }
    
    if (!timezoneData.dst) {
      return timezoneData.offset
    }
    // dst 가 있을 경우의 로직 추가
    return 0
  }

  const makeFormatParts = (timestamp: number, timezone: TimezoneType, options: DtfCacheOption = {}) => {
    const date = new Date(timestamp)
    const dtf = getDateTimeFormatForOffset(timezone, options)
    return dtf.formatToParts(date) as DateTimeFormatPart[]
  }

  const tzOffset = (timestamp: number, timezone: TimezoneType) => {
    if (![null, undefined].includes(timezoneDataMap[timezone]) ) {
      return getTargetOffset(new Date(timestamp), timezone)
    }
    const formatResult = makeFormatParts(timestamp, timezone)
    const filled = []
    for (let i = 0; i < formatResult.length; i += 1) {
      const { type, value } = formatResult[i]
      const pos = typeToPos[type]

      if (pos >= 0) {
        filled[pos] = parseInt(value, 10)
      }
    }
    const hour = filled[3]
    // Workaround for the same behavior in different node version
    // https://github.com/nodejs/node/issues/33027
    /* istanbul ignore next */
    const fixedHour = hour === 24 ? 0 : hour
    const utcString = `${filled[0]}-${filled[1]}-${filled[2]} ${fixedHour}:${filled[4]}:${filled[5]}:000`
    const utcTs = d.utc(utcString).valueOf()
    let asTS = +timestamp
    const over = asTS % 1000
    asTS -= over
    return (utcTs - asTS) / (60 * 1000)
  }

  // find the right offset a given local time. The o input is our guess, which determines which
  // offset we'll pick in ambiguous cases (e.g. there are two 3 AMs b/c Fallback DST)
  // https://github.com/moment/luxon/blob/master/src/datetime.js#L76
  const fixOffset = (localTS: number, o0: number, tz: TimezoneType) => {
    // Our UTC time is just a guess because our offset is just a guess
    let utcGuess = localTS - (o0 * 60 * 1000)
    // Test whether the zone matches the offset for this ts
    const o2 = tzOffset(utcGuess, tz)
    // If so, offset didn't change and we're done
    if (o0 === o2) {
      return [utcGuess, o0]
    }
    // If not, change the ts by the difference in the offset
    utcGuess -= (o2 - o0) * 60 * 1000
    // If that gives us the local time we want, we're done
    const o3 = tzOffset(utcGuess, tz)
    if (o2 === o3) {
      return [utcGuess, o2]
    }
    // If it's different, we're in a hole time.
    // The offset has changed, but the we don't adjust the time
    return [localTS - (Math.min(o2, o3) * 60 * 1000), Math.max(o2, o3)]
  }

  const proto = c.prototype

  proto.tz = function (timezone = defaultTimezone, keepLocalTime?: boolean) {
    const oldOffset = this.utcOffset()
    const date = this.toDate()
    
    let ins = null
    let diff = 0
    if (timezoneDataMap[timezone]) {
      // timezoneDst 정보가 있을 경우 가속 연산
      const offset = getTargetOffset(date, timezone)
      diff = d().utcOffset() - offset
      ins = d(date.valueOf() - (diff * 1000 * 60))
    } else {
      // toLocaleDateString은 Invalid Date가 들어와도 에러를 반환하지 않음
      // IE에서 \u200E 때문에 new Date(formattedString)이 동작하지 않는 이슈 대응
      const target = this.isValid() ? getDateTimeFormat(timezone).format(date).replace(/\u200E/g, '') : date.toLocaleString()
      diff = Math.round((date - new Date(target).valueOf()) / 1000 / 60)
      ins = d(target).$set(MS, this.$ms)
    }
    ins.utcOffset((-Math.round(date.getTimezoneOffset() / 15) * 15) - diff, true)
    if (keepLocalTime) {
      const newOffset = ins.utcOffset()
      ins = ins.add(oldOffset - newOffset, MIN)
    }
    ins.$x.$timezone = timezone
    return ins
  }

  proto.offsetName = function (type: 'short' | 'long') {
    // type: short(default) / long
    const zone = this.$x.$timezone || d.tz.guess()
    const result = makeFormatParts(this.valueOf(), zone, { timeZoneName: type }).find(m => m.type.toLowerCase() === 'timezonename')
    return result && result.value
  }

  const oldStartOf = proto.startOf
  proto.startOf = function (units: OpUnitType, startOf?: unknown): Dayjs {
    if (!this.$x || !this.$x.$timezone) {
      return oldStartOf.call(this, units, startOf)
    }

    const withoutTz = d(this.format('YYYY-MM-DD HH:mm:ss:SSS'))
    const startOfWithoutTz = oldStartOf.call(withoutTz, units, startOf)
    return startOfWithoutTz.tz(this.$x.$timezone, true)
  }

  d.tz = function (input: ConfigType, arg1?: string | TimezoneType, arg2?: TimezoneType) {
    const parseFormat = arg2 && arg1
    const timezone = arg2 || arg1 || defaultTimezone
    const previousOffset = tzOffset(+d(), timezone)
    if (typeof input !== 'string') {
      // timestamp number || js Date || Day.js
      return d(input).tz(timezone)
    }
    const localTs = d.utc(input, parseFormat).valueOf()
    const [targetTs, targetOffset] = fixOffset(localTs, previousOffset, timezone)
    const ins = d(targetTs).utcOffset(targetOffset)
    ins.$x.$timezone = timezone
    return ins
  } as DayjsTimezone

  d.tz.guess = function () {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  d.tz.setDefault = function (timezone: TimezoneType) {
    defaultTimezone = timezone
  }

  // 인스턴스 생성, changeTimezone 할 때 생성
  d.tz.refreshDTF = function (timezone: TimezoneType) {
    setDateTimeFormat(timezone)
  }

  // timezone dst 초기화
  d.tz.useTimezoneData = function (timezoneData: TimezoneDataMap) {
    timezoneDataMap = { ...timezoneData }
  }

  d.tz.getTimezoneData = function (timezone: TimezoneType) {
    if (timezone) {
      return timezoneDataMap[timezone]
    }
  }
}

export default customTimezonePlugin
