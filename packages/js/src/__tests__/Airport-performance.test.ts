// Airport
// Copyright 2024-present NAVER Corp.
// MIT License

import { Airport } from '../Airport'
import { Currency } from '../types'

describe('Airport performance test', () => {
  const supportedLocales = ['ko-KR', 'en-US', 'ja-JP'] as const

  let airport: Airport<typeof supportedLocales>
  beforeEach(() => {
    airport = new Airport({
      supportedLocales,
      locale: 'ko-KR',
      fallbackLocale: 'ko-KR',
      currency: {
        'ko-KR': Currency.KRW,
        'en-US': Currency.USD,
        'ja-JP': Currency.JPY,
      },
    })
  })

  test('Intl.NumberFormat performance test', () => {
    console.time('Intl.NumberFormat performance test')

    for (let i = 0; i < 100000; i++) {
      new Intl.NumberFormat('ko-KR').format(10000)
    }

    console.timeEnd('Intl.NumberFormat performance test')
  })

  test('fn function performance test', () => {
    console.time('fn performance test')

    for (let i = 0; i < 100000; i++) {
      airport.fn(10000)
    }

    console.timeEnd('fn performance test')
  })

  test('fn function performance test when the roundingMode option is given', () => {
    console.time('roundingMode fn performance test')

    for (let i = 0; i < 100000; i++) {
      airport.fn(10000, { roundingMode: 'ceil' })
    }

    console.timeEnd('roundingMode fn performance test')
  })

  test(`fc function performace test`, () => {
    console.time('fc performance test')

    for (let i = 0; i < 100000; i++) {
      airport.fc(10000)
    }

    console.timeEnd('fc performance test')
  })
})
