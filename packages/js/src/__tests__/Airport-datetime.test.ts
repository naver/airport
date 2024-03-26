// Airport
// Copyright 2024-present NAVER Corp.
// MIT License

import * as dayjs from 'dayjs'

import { Airport } from '../Airport'
import { Timezone } from '../types'

describe('Airport datetime functions test', () => {
  const supportedLocales = ['ko', 'en-US', 'ja'] as const

  let airport: Airport<typeof supportedLocales>
  beforeEach(() => {
    airport = new Airport({
      supportedLocales,
      locale: 'ko',
      fallbackLocale: 'ko',
    })
  })

  test('airport.dayjs() works same with dayjs()', () => {
    const specificDayFromAirport = airport.dayjs('2018-04-04T16:00:00.000Z')
    const specificDayFromDayjs = dayjs('2018-04-04T16:00:00.000Z').tz(airport.getTimezone())

    expect(specificDayFromAirport).toEqual(specificDayFromDayjs)
  })

  test("airport.dayjs()'s current locale is the locale of airport.", () => {
    const firstDayjsLocale = airport.dayjs().locale()
    expect(firstDayjsLocale).toBe(airport.getDayjsLocaleName())

    airport.changeLocale('en-US')

    const secondDayjsLocale = airport.dayjs().locale()
    expect(secondDayjsLocale).toBe(airport.getDayjsLocaleName())
  })

  test("airport.dayjs()'s locale is applied well.", () => {
    const ko20210101 = airport.dayjs('2021-01-01')
    expect(ko20210101.format('MMMM')).toBe('1월')

    airport.changeLocale('en-US')

    const en20210101 = airport.dayjs('2021-01-01')
    expect(en20210101.format('MMMM')).toBe('January')
  })

  test('airport.dayjs() can use forcedLocale', () => {
    expect(airport.getLocale()).toBe('ko')

    const forcedEn20210101 = airport.dayjs('2021-01-01', 'en-US')
    expect(forcedEn20210101.format('MMMM')).toBe('January')
  })

  test('airport.fnow() with timezone works well', () => {
    const dayjsTodayDate = airport.dayjs().tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
    expect(airport.fnow('YYYY-MM-DD')).toBe(dayjsTodayDate.format('YYYY-MM-DD'))
  })

  test('airport.fnow() can set custom timezone', () => {
    const customTimezone = 'Pacific/Fiji'
    const fijiAirport = new Airport({
      supportedLocales,
      locale: 'ko',
      fallbackLocale: 'ko',
      timezone: customTimezone,
    })
    expect(fijiAirport.getTimezone()).toBe(customTimezone)
    expect(airport.getTimezone()).not.toBe(fijiAirport.getTimezone())

    expect(airport.fnow('YYYY-MMMM-DD', customTimezone)).toBe(fijiAirport.fnow('YYYY-MMMM-DD'))
  })

  test('airport.fnow() can use forcedLocale', () => {
    const enUSAirport = new Airport({
      supportedLocales,
      locale: 'en-US',
      fallbackLocale: 'ko',
    })
    expect(enUSAirport.getLocale()).toBe('en-US')

    const enLocaleTodayDate = enUSAirport.dayjs().format('YYYY-MMMM-DD')
    expect(airport.fnow('YYYY-MMMM-DD', null, 'en-US')).toBe(enLocaleTodayDate)
  })

  test('airport.fd() can format time', () => {
    const koJan = airport.fd('2021-01-01', 'MMMM')
    expect(koJan).toBe('1월')

    airport.changeLocale('en-US')

    const enJan = airport.fd('2021-01-01', 'MMMM')
    expect(enJan).toBe('January')
  })

  test('airport.fd() works well when using Date object without format param', () => {
    expect(airport.fd(new Date())).not.toBe('Invalid Date')
    expect(airport.fd(new Date().getTime())).not.toBe('Invalid Date')
  })

  test('airport.fd() can use forcedLocale', () => {
    expect(airport.getLocale()).toBe('ko')

    const forcedEnJan = airport.fd('2021-01-01', 'MMMM', null, 'en-US')
    expect(forcedEnJan).toBe('January')
  })

  test('airport.fd() can format time with explicit timezone', () => {
    const koJan = airport.fd('2021-01-01', 'MMMM', Timezone.AsiaSeoul)
    expect(koJan).toBe('1월')

    airport.changeLocale('en-US')

    const enJan = airport.fd('2021-01-01', 'MMMM', 'America/Los_Angeles')
    expect(enJan).toBe('January')
  })

  test('diffInCalendarDays plugin works', () => {
    const datetime1 = airport.dayjs('2021-01-26T14:00:00.000Z')
    const datetime2 = airport.dayjs('2021-01-29T01:00:00.000Z')

    expect(datetime2.diff(datetime1, 'day')).toBe(2)
    expect(datetime2.diffInCalendarDays(datetime1)).toBe(3)
  })

  test('diffInCalendarDays plugin works as 0 in same day', () => {
    const datetime1 = airport.dayjs('2021-01-29T16:00:00.000Z')
    const datetime2 = airport.dayjs('2021-01-29T18:00:00.000Z')

    expect(datetime2.diff(datetime1, 'day')).toBe(0)
    expect(datetime2.diffInCalendarDays(datetime1)).toBe(0)
  })

  test('diffInCalendarMonths plugin works', () => {
    const datetime1 = airport.dayjs('2021-01-31T00:00:00.000Z')
    const datetime2 = airport.dayjs('2021-09-01T00:00:00.000Z')

    expect(datetime2.diff(datetime1, 'month')).toBe(7)
    expect(datetime2.diffInCalendarMonths(datetime1)).toBe(8)
  })

  test('diffInCalendarMonths plugin works as 0 in same month', () => {
    const datetime1 = airport.dayjs('2021-09-01T00:00:00.000Z')
    const datetime2 = airport.dayjs('2021-09-30T00:20:00.000Z')

    expect(datetime2.diff(datetime1, 'month')).toBe(0)
    expect(datetime2.diffInCalendarMonths(datetime1)).toBe(0)
  })

  test('diffInCalendarYears plugin works', () => {
    const datetime1 = airport.dayjs('2019-09-01T02:00:00.000Z')
    const datetime2 = airport.dayjs('2021-09-01T00:00:00.000Z')

    expect(datetime2.diff(datetime1, 'year')).toBe(1)
    expect(datetime2.diffInCalendarYears(datetime1)).toBe(2)
  })

  test('diffInCalendarYears plugin works as 0 in same year', () => {
    const datetime1 = airport.dayjs('2021-01-01T00:00:00.000Z')
    const datetime2 = airport.dayjs('2021-12-31T00:00:00.000Z')

    expect(datetime2.diff(datetime1, 'year')).toBe(0)
    expect(datetime2.diffInCalendarYears(datetime1)).toBe(0)
  })

  test('Timezone option works', () => {
    const localAirport = new Airport({
      supportedLocales,
      locale: 'ko',
      fallbackLocale: 'ko',
      timezone: 'Pacific/Fiji',
    })

    const midnight = localAirport.dayjs().set('hour', 0)

    expect(midnight.isToday()).toBe(true)
    // expect(midnight.tz('Asia/Seoul').isToday()).toBe(false)
  })

  test('airport.fd() with timezone works', () => {
    const localAirport = new Airport({
      supportedLocales,
      locale: 'ko',
      fallbackLocale: 'ko',
      timezone: 'Pacific/Auckland',
    })

    const fdResult = localAirport.fd(localAirport.dayjs(), 'YYYY-MM-DD')
    const fdTwiced = localAirport.fd(localAirport.fd(localAirport.dayjs(), 'YYYY-MM-DD'), 'YYYY-MM-DD')
    const fnowResult = localAirport.fnow('YYYY-MM-DD')

    expect(fdResult).toBe(fdTwiced)
    expect(fdResult).toBe(fnowResult)
  })

  test('default isToday() is always true not related to timezone', () => {
    // +12:00
    const fijiAirport = new Airport({
      supportedLocales,
      locale: 'ko',
      fallbackLocale: 'ko',
      timezone: 'Pacific/Fiji',
    })

    // -10:00
    const honoluluAirport = new Airport({
      supportedLocales,
      locale: 'ko',
      fallbackLocale: 'ko',
      timezone: 'Pacific/Honolulu',
    })

    const fijiNow = fijiAirport.dayjs()
    const honoluluNow = honoluluAirport.dayjs()

    expect(fijiNow.isToday()).toBe(true)
    expect(honoluluNow.isToday()).toBe(true)
  })
})

describe('Airport for timezone', () => {
  const supportedLocales = ['ko', 'en'] as const
  const timezone = 'Pacific/Honolulu' // -10:00

  const airport = new Airport({
    supportedLocales,
    timezone,
    locale: 'ko',
    fallbackLocale: 'ko',
  })

  test('Airport set up default timezone correctly', () => {
    const localAirport = new Airport({
      supportedLocales,
      locale: 'ko',
      fallbackLocale: 'ko',
    })
    expect(localAirport.getTimezone()).toBe(Intl.DateTimeFormat().resolvedOptions().timeZone)
  })

  test('Airport can change timezone', () => {
    const localAirport = new Airport({
      supportedLocales,
      locale: 'ko',
      fallbackLocale: 'ko',
    })
    localAirport.changeTimezone(timezone)
    expect(localAirport.getTimezone()).toBe(timezone)
  })

  test('Make YYYY-MM-DD local timezone', () => {
    expect(airport.dayjs('2020-05-03').format()).toBe('2020-05-03T00:00:00-10:00')
    expect(airport.dayjs('2020-05-03T00:00').format()).toBe('2020-05-03T00:00:00-10:00')
    expect(airport.dayjs('2020-05-03T00:00:00+09:00').format()).toBe('2020-05-02T05:00:00-10:00')
  })

  test('isSame method works', () => {
    expect(airport.dayjs('2020-05-03').isSame('2020-05-03')).toBe(true)
    expect(airport.dayjs('2020-05-03').isSame('2020-05-03T00:00:00-10:00')).toBe(true)
  })

  test('isAfter method works', () => {
    expect(airport.dayjs('2020-05-03').isAfter('2020-05-03')).toBe(false)
    expect(airport.dayjs('2020-05-03').isAfter('2020-05-02')).toBe(true)
    expect(airport.dayjs('2020-05-03T01:00:00-10:00').isAfter('2020-05-03')).toBe(true)
  })

  test('isSameOrAfter plugin works', () => {
    expect(airport.dayjs('2020-05-03').isSameOrAfter('2020-05-03')).toBe(true)
    expect(airport.dayjs('2020-05-03').isSameOrAfter('2020-05-02')).toBe(true)
    expect(airport.dayjs('2020-05-03T01:00:00-10:00').isSameOrAfter('2020-05-03')).toBe(true)
  })

  test('isBefore method works', () => {
    expect(airport.dayjs('2020-05-03').isBefore('2020-05-03')).toBe(false)
    expect(airport.dayjs('2020-05-03').isBefore('2020-05-03T01:00:00-10:00')).toBe(true)
    expect(airport.dayjs('2020-05-03T01:00:00-10:00').isBefore('2020-05-03')).toBe(false)
  })

  test('diff method works', () => {
    expect(airport.dayjs('2021-04-01').diff('2021-04-04', 'day')).toBe(-3)
    expect(airport.dayjs('2021-04-01T00:00:00+09:00').diff('2021-04-04', 'hour')).toBe(-91)
    expect(airport.dayjs('2021-04-04').diff('2021-04-01T00:00:00+09:00', 'hour')).toBe(91)
  })

  test('airport.fd can format datetime.', () => {
    expect(airport.fd('2020-05-03', 'YYYY-MM-DD')).toBe('2020-05-03')
    expect(airport.fd('2020-05-03T00:00:00+09:00', 'YYYY-MM-DD')).toBe('2020-05-02')
    expect(airport.fd('2020-05-03', 'YYYY-MM-DDTHH:mm:ssZ')).toBe('2020-05-03T00:00:00-10:00')
  })

  test('Timezone plugin performance should be optimized.', () => {
    const now = performance.now()
    for (let i = 0; i < 50000; i += 1) {
      airport.dayjs('2020-05-03').isAfter('2020-05-04')
    }
    const duration = performance.now() - now
    console.log('timezone performance 1:', duration)
    expect(duration).toBeLessThan(2000)

    const now2 = performance.now()
    const endDateDayjs = airport.dayjs('2020-05-04')
    for (let i = 0; i < 50000; i += 1) {
      airport.dayjs('2020-05-03').isAfter(endDateDayjs)
    }
    const duration2 = performance.now() - now2
    console.log('timezone performance 2:', duration2)
    expect(duration2).toBeLessThan(1000)
  })

  test('TimezoneDataMap works', () => {
    const supportedLocales = ['ko', 'en'] as const
    const timezone = 'Pacific/Honolulu' // -10:00

    const airport = new Airport({
      supportedLocales,
      timezone,
      locale: 'ko',
      fallbackLocale: 'ko',
      timezoneData: {
        [timezone]: {
          offset: -600,
          dst: null,
        },
      },
    })

    const airportWithoutData = new Airport({
      supportedLocales,
      timezone,
      locale: 'ko',
      fallbackLocale: 'ko',
    })

    const now1 = performance.now()
    for (let i = 0; i < 50000; i += 1) {
      airport.dayjs('2020-05-03').isAfter('2020-05-04')
    }
    const duration = performance.now() - now1
    console.log('timezone data performance 1:', duration)
    expect(duration).toBeLessThan(2000)

    const now2 = performance.now()
    const endDateDayjs = airport.dayjs('2020-05-04')
    for (let i = 0; i < 50000; i += 1) {
      airport.dayjs('2020-05-03').isAfter(endDateDayjs)
    }
    const duration2 = performance.now() - now2
    console.log('timezone data performance 2:', duration2)
    expect(duration2).toBeLessThan(1000)

    const now = airport.dayjs()
    const nowWithoutData = airportWithoutData.dayjs()

    expect(now.year()).toBe(nowWithoutData.year())
    expect(now.month()).toBe(nowWithoutData.month())
    expect(now.date()).toBe(nowWithoutData.date())
    expect(now.hour()).toBe(nowWithoutData.hour())
    expect(now.minute()).toBe(nowWithoutData.minute())
    expect(now.second()).toBe(nowWithoutData.second())
    expect(now.utcOffset()).toBe(nowWithoutData.utcOffset())

    const startOfWeek = airport.dayjs('2021-07-20T08:00:05+09:00').startOf('week')

    expect(airport.dayjs(startOfWeek).add(1, 'day').format()).toBe('2021-07-19T00:00:00-10:00')
  })
})
