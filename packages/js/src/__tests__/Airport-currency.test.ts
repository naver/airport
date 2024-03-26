// Airport
// Copyright 2024-present NAVER Corp.
// MIT License

import { Airport } from '../Airport'
import { Currency } from '../types'

describe('Airport currency functions test', () => {
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

  test('airport.fc() can format by locale and currency pair', () => {
    const value = 100000

    const koKrFormatted = airport.fc(value)
    const koKrKrwIntlFormatted = new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value)

    expect(koKrFormatted).toBe(koKrKrwIntlFormatted)

    airport.changeLocale('en-US')

    const enUsFormatted = airport.fc(value)
    const enUsUsdIntlFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

    expect(enUsFormatted).toBe(enUsUsdIntlFormatted)
  })

  test('airport.fc() can use forcedLocale', () => {
    expect(airport.getLocale()).toBe('ko-KR')

    const value = 100000

    const enUsFormatted = airport.fc(value, null, null, null, 'en-US')
    const enUsUsdIntlFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

    expect(enUsFormatted).toBe(enUsUsdIntlFormatted)
  })

  test('airport.fc() can format with custom currencyFormat when it exists', () => {
    const localAirport = new Airport({
      supportedLocales,
      locale: 'ko-KR',
      fallbackLocale: 'ko-KR',
      currency: {
        'ko-KR': Currency.KRW,
        'en-US': Currency.USD,
        'ja-JP': Currency.JPY,
      },
      currencyFormat: {
        [Currency.KRW]: '{v}원입니다.',
        [Currency.USD]: 'Price is ${v}.',
      },
    })

    const value = 100000

    const koKrLsBasedFormatted = localAirport.fc(value)
    const koKrIntlNumberFormatted = new Intl.NumberFormat('ko-KR').format(value)
    expect(koKrLsBasedFormatted).toBe(`${koKrIntlNumberFormatted}원입니다.`)

    localAirport.changeLocale('en-US')

    const enUsLsBasedFormatted = localAirport.fc(value)
    const enUsIntlNumberFormatted = new Intl.NumberFormat('en-US').format(value)
    expect(enUsLsBasedFormatted).toBe(`Price is $${enUsIntlNumberFormatted}.`)

    localAirport.changeLocale('ja-JP')

    const jaJpLsBasedFormatted = localAirport.fc(value)
    const jaJpIntlFormatted = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value)
    expect(jaJpLsBasedFormatted).toBe(jaJpIntlFormatted)
  })

  test('airport.fc() can use custom currencyFormatValueKey', () => {
    const localAirport = new Airport({
      supportedLocales,
      locale: 'ko-KR',
      fallbackLocale: 'ko-KR',
      currency: {
        'ko-KR': Currency.KRW,
        'en-US': Currency.USD,
        'ja-JP': Currency.JPY,
      },
      currencyFormatValueKey: 'price',
      currencyFormat: {
        [Currency.KRW]: '{price}원입니다.',
      },
    })

    const value = 100000

    const koKrLsBasedFormatted = localAirport.fc(value)
    const koKrIntlNumberFormatted = new Intl.NumberFormat('ko-KR').format(value)
    expect(koKrLsBasedFormatted).toBe(`${koKrIntlNumberFormatted}원입니다.`)
  })

  test('airport.fc() can override format with customFormat as argument', () => {
    const localAirport = new Airport({
      supportedLocales,
      locale: 'ko-KR',
      fallbackLocale: 'ko-KR',
      currency: {
        'ko-KR': Currency.KRW,
        'en-US': Currency.USD,
        'ja-JP': Currency.JPY,
      },
      currencyFormat: {
        [Currency.KRW]: '{v}원입니다.',
        [Currency.USD]: 'Price is ${v}.',
      },
    })

    const value = 100000

    const koKrLsBasedFormatted = localAirport.fc(value, '총 가격은 {v}원 입니다!')
    const koKrIntlNumberFormatted = new Intl.NumberFormat('ko-KR').format(value)
    expect(koKrLsBasedFormatted).toBe(`총 가격은 ${koKrIntlNumberFormatted}원 입니다!`)

    localAirport.changeLocale('en-US')

    const enUsLsBasedFormatted = localAirport.fc(value, 'Total price is {v}!')
    const enUsIntlNumberFormatted = new Intl.NumberFormat('en-US').format(value)
    expect(enUsLsBasedFormatted).toBe(`Total price is ${enUsIntlNumberFormatted}!`)

    localAirport.changeLocale('ja-JP')

    const jaJpLsBasedFormatted = localAirport.fc(value, '合計価格は{v}円です！')
    const jaJpIntlFormatted = new Intl.NumberFormat('ja-JP').format(value)
    expect(jaJpLsBasedFormatted).toBe(`合計価格は${jaJpIntlFormatted}円です！`)
  })

  test('airport.fc() with baseCurrency can apply exchange.', () => {
    const usd = 1
    const usdToKrw = 1135.50
    const usdToJpy = 104.34

    const localAirport = new Airport({
      supportedLocales,
      locale: 'ko-KR',
      fallbackLocale: 'ko-KR',
      currency: {
        'ko-KR': Currency.KRW,
        'en-US': Currency.USD,
        'ja-JP': Currency.JPY,
      },
      exchangeRate: {
        [Currency.USD]: usd,
        [Currency.KRW]: usdToKrw,
        [Currency.JPY]: usdToJpy,
      }
    })

    const value = 100000

    const krwPrice = localAirport.fc(value, null, Currency.JPY)
    const exchangedValue = (value / (usdToJpy / usd)) * (usdToKrw / usd)
    const koKrKrwIntlFormatted = new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(exchangedValue)

    expect(krwPrice).toBe(koKrKrwIntlFormatted)
  })

  test('airport.fc() with baseCurrency displays fixed currency when exchangeRate is not given.', () => {
    const usd = 1
    const usdToKrw = 1135.50

    const localAirport = new Airport({
      supportedLocales,
      locale: 'ko-KR',
      fallbackLocale: 'ko-KR',
      currency: {
        'ko-KR': Currency.KRW,
        'en-US': Currency.USD,
        'ja-JP': Currency.JPY,
      },
      exchangeRate: {
        [Currency.USD]: usd,
        [Currency.KRW]: usdToKrw,
      }
    })

    const value = 100000

    const krwPrice = localAirport.fc(value, null, Currency.JPY)
    const koKrKrwIntlFormatted = new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'JPY' }).format(value)

    expect(krwPrice).toBe(koKrKrwIntlFormatted)
  })

  test('airport.fc() with baseCurrency can apply exchange by custom keyCurrency', () => {
    const krw = 1000
    const krwToJyp = 91.9887

    const supportedLocales = ['ko-KR', 'ja-JP'] as const
    const localAirport = new Airport({
      supportedLocales,
      locale: 'ko-KR',
      fallbackLocale: 'ko-KR',
      currency: {
        'ko-KR': Currency.KRW,
        'ja-JP': Currency.JPY,
      },
      keyCurrency: Currency.KRW,
      exchangeRate: {
        [Currency.KRW]: krw,
        [Currency.JPY]: krwToJyp,
      }
    })

    const value = 100000

    const krwPrice = localAirport.fc(value, null, Currency.JPY)
    const exchangedValue = (value / (krwToJyp / krw)) * (krw / krw)
    const koKrKrwIntlFormatted = new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(exchangedValue)

    expect(krwPrice).toBe(koKrKrwIntlFormatted)
  })

  test('airport throws error when keyCurrency is not supported currency.', () => {
    expect(() => {
      new Airport({
        supportedLocales,
        locale: 'ko-KR',
        fallbackLocale: 'ko-KR',
        currency: {
          'ko-KR': Currency.KRW,
          'en-US': Currency.USD,
          'ja-JP': Currency.JPY,
        },
        keyCurrency: 'GBP'
      })
    }).toThrow()
  })

  test('airport.fc() can format isFixedCurrency with baseCurrency', () => {
    const value = 100000

    const koKrIntlBasedFormatted = airport.fc(value, null, Currency.KRW, true)
    const koKrKrwIntlFormatted = new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value)

    expect(koKrIntlBasedFormatted).toBe(koKrKrwIntlFormatted)

    airport.changeLocale('en-US')

    const enUsIntlBasedFormatted = airport.fc(value, null, Currency.KRW, true)
    const enUsKrwIntlFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'KRW' }).format(value)
    expect(enUsIntlBasedFormatted).toBe(enUsKrwIntlFormatted)

    const formattedCurrencyAirport = new Airport({
      supportedLocales,
      locale: 'ko-KR',
      fallbackLocale: 'ko-KR',
      currency: {
        'ko-KR': Currency.KRW,
        'en-US': Currency.USD,
        'ja-JP': Currency.JPY,
      },
      currencyFormat: {
        [Currency.KRW]: '{v}원입니다.',
      },
    })

    const koKrLsBasedFormatted = formattedCurrencyAirport.fc(value, null, Currency.KRW, true)
    const koKrIntlNumberFormatted = new Intl.NumberFormat('ko-KR').format(value)
    expect(koKrLsBasedFormatted).toBe(`${koKrIntlNumberFormatted}원입니다.`)

    formattedCurrencyAirport.changeLocale('en-US')

    const enUsLsBasedFormatted = formattedCurrencyAirport.fc(value, null, Currency.KRW, true)
    const enUsIntlNumberFormatted = new Intl.NumberFormat('en-US').format(value)
    expect(enUsLsBasedFormatted).toBe(`${enUsIntlNumberFormatted}원입니다.`)
  })

})
