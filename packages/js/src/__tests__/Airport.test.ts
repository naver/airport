// Airport
// Copyright 2024-present NAVER Corp.
// MIT License

import { Airport } from '../Airport'
import { Options } from '../types'

describe('Airport Class', () => {
  const supportedLocales = ['ko', 'en', 'en-GB', 'ja', 'jh-CN'] as const
  const globalLS = {
    hello: {
      ko: '안녕하세요.',
      en: 'Hello.',
      'en-GB': 'Hello.',
      ja: 'こんにちは。',
      'jh-CN': '你好。',
    },
  }

  let airport: Airport<typeof supportedLocales, typeof globalLS>
  let enGBAirport: Airport<typeof supportedLocales, typeof globalLS>
  beforeEach(() => {
    airport = new Airport({
      supportedLocales,
      globalLS,
      locale: 'ko',
      fallbackLocale: 'ko',
    })
    enGBAirport = new Airport({
      supportedLocales,
      locale: 'en-GB',
      fallbackLocale: 'en-GB',
    })
  })

  test('Airport can analysis locale', () => {
    expect(airport.getLocale()).toBe('ko')
    expect(enGBAirport.getLocale()).toBe('en-GB')
  })

  test('Airport can analysis language', () => {
    expect(airport.getLanguage()).toBe('ko')
    expect(enGBAirport.getLanguage()).toBe('en')
  })

  test('Airport can analysis region', () => {
    expect(enGBAirport.getRegion()).toBe('GB')
  })

  test('Airport returns "undefined" region value for locale code without region info', () => {
    expect(airport.getRegion()).toBe(undefined)
  })

  test('Airport can change locale', () => {
    expect(airport.getLocale()).toBe('ko')
    expect(airport.getLanguage()).toBe('ko')
    expect(airport.getRegion()).toBe(undefined)

    airport.changeLocale('en-GB')

    expect(airport.getLocale()).toBe('en-GB')
    expect(airport.getLanguage()).toBe('en')
    expect(airport.getRegion()).toBe('GB')
  })

  test('Airport can use language based locale though received language is supported but region is not', () => {
    airport.changeLocale('en-KR' as 'ja') // use 'as' for preventing ts error
    expect(airport.getLocale()).toBe('en-KR')
    expect(airport.getLanguage()).toBe('en')
    expect(airport.getRegion()).toBe('KR')
  })

  test('Airport can use fallbackLocale when received language is not supported', () => {
    airport.changeLocale('de' as 'en') // use 'as' for preventing ts error
    expect(airport.getLocale()).toBe('ko')
    expect(airport.getLanguage()).toBe('ko')
    expect(airport.getRegion()).toBe(undefined)
  })

  test('Airport can get options of airport instance', () => {
    const options: Options<typeof supportedLocales, typeof globalLS> = {
      supportedLocales,
      globalLS,
      locale: 'ko',
      fallbackLocale: 'ko',
    }
    const localAirport = new Airport(options)
    expect(localAirport.getOptions()).toStrictEqual(options)
  })
})

describe('Airport number formatting test', () => {
  test('airport.fn() returns value based on Intl.NumberFormat', () => {
    const supportedLocales = ['ko', 'nl'] as const
    const localAirport = new Airport({
      supportedLocales,
      locale: 'ko',
      fallbackLocale: 'ko',
    })

    const value = 100000
    expect(localAirport.fn(value)).toBe(new Intl.NumberFormat('ko').format(value))

    localAirport.changeLocale('nl')

    expect(localAirport.fn(value)).toBe(new Intl.NumberFormat('nl').format(value))
  })

  test('airport.fn() can use forcedLocale', () => {
    const supportedLocales = ['ko', 'nl'] as const
    const localAirport = new Airport({
      supportedLocales,
      locale: 'ko',
      fallbackLocale: 'ko',
    })

    const value = 100000

    expect(localAirport.getLocale()).toBe('ko')
    expect(localAirport.fn(value, undefined, 'nl')).toBe(new Intl.NumberFormat('nl').format(value))
  })

  test('airport.fn() returns correct value when option is changed', () => {
    const supportedLocales = ['ko', 'nl'] as const
    const localAirport = new Airport({
      supportedLocales,
      locale: 'ko',
      fallbackLocale: 'ko',
    })

    const value = 0.335
    expect(localAirport.fn(value, { style: 'percent' })).toBe('34%')
    expect(localAirport.fn(value)).toBe('0.335')
    expect(localAirport.fn(value, { maximumFractionDigits: 2 })).toBe('0.34')
    expect(localAirport.fn(30.1634, { maximumSignificantDigits: 3 })).toBe('30.2')
  })

  test('airport.fn() returns correct value when roundingMode option is given', () => {
    const supportedLocales = ['ko', 'nl'] as const
    const localAirport = new Airport({
      supportedLocales,
      locale: 'ko',
      fallbackLocale: 'ko',
    })

    const testNum1 = 0.33357
    expect(localAirport.fn(testNum1)).toBe('0.334')
    expect(localAirport.fn(testNum1, { roundingMode: 'ceil' })).toBe('0.334')
    expect(localAirport.fn(testNum1, { roundingMode: 'round' })).toBe('0.334')
    expect(localAirport.fn(testNum1, { roundingMode: 'floor' })).toBe('0.333')

    const testNum2 = 3055.5321234
    expect(localAirport.fn(testNum2, { maximumSignificantDigits: 2 })).toBe('3,100')
    expect(localAirport.fn(testNum2, { maximumSignificantDigits: 2, roundingMode: 'ceil' })).toBe('3,100')
    expect(localAirport.fn(testNum2, { maximumSignificantDigits: 2, roundingMode: 'round' })).toBe('3,100')
    expect(localAirport.fn(testNum2, { maximumSignificantDigits: 2, roundingMode: 'floor' })).toBe('3,000')

    const testNum3 = 3035.5321234
    expect(localAirport.fn(testNum3, { maximumSignificantDigits: 2 })).toBe('3,000')
    expect(localAirport.fn(testNum3, { maximumSignificantDigits: 2, roundingMode: 'ceil' })).toBe('3,100')
    expect(localAirport.fn(testNum3, { maximumSignificantDigits: 2, roundingMode: 'round' })).toBe('3,000')
    expect(localAirport.fn(testNum3, { maximumSignificantDigits: 2, roundingMode: 'floor' })).toBe('3,000')

    const testNum4 = -13.23455
    expect(localAirport.fn(testNum4, { maximumFractionDigits: 2 })).toBe('-13.23')
    expect(localAirport.fn(testNum4, { maximumFractionDigits: 2, roundingMode: 'ceil' })).toBe('-13.23')
    expect(localAirport.fn(testNum4, { maximumFractionDigits: 2, roundingMode: 'round' })).toBe('-13.23')
    expect(localAirport.fn(testNum4, { maximumFractionDigits: 2, roundingMode: 'floor' })).toBe('-13.24')

    const testNum5 = -13.23655
    expect(localAirport.fn(testNum5, { maximumFractionDigits: 2 })).toBe('-13.24')
    expect(localAirport.fn(testNum5, { maximumFractionDigits: 2, roundingMode: 'ceil' })).toBe('-13.23')
    expect(localAirport.fn(testNum5, { maximumFractionDigits: 2, roundingMode: 'round' })).toBe('-13.24')
    expect(localAirport.fn(testNum5, { maximumFractionDigits: 2, roundingMode: 'floor' })).toBe('-13.24')
  })
})
