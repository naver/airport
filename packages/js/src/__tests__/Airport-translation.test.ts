// Airport
// Copyright 2024-present NAVER Corp.
// MIT License

import { Airport } from '../Airport'
import { createLSFactory } from '../utils'

describe('Airport translation functions test', () => {
  const supportedLocales = ['ko', 'en', 'en-GB', 'ja', 'jh-CN'] as const
  type LocaleType = typeof supportedLocales
  const createLS = createLSFactory<LocaleType>()
  const createPartialLS = createLSFactory<LocaleType, false>()
  const globalLS = createLS({
    hello: {
      ko: '안녕하세요.',
      en: 'Hello.',
      'en-GB': 'Hello.',
      ja: 'こんにちは。',
      'jh-CN': '你好。',
    },
  })

  let airport: Airport<LocaleType, typeof globalLS>

  beforeEach(() => {
    airport = new Airport({
      supportedLocales,
      globalLS,
      locale: 'ko',
      fallbackLocale: 'ko',
    })
  })

  test('airport.t() can translate LSO', () => {
    const LS = airport.createLS({
      hello: {
        ko: '안녕하세요, 이것은 색입니다.',
        en: 'Hello, This is color.',
        'en-GB': 'Hello, This is colour.',
        ja: 'こんにちは, これは色です。',
        'jh-CN': '你好，这是颜色。',
      },
    })
    expect(airport.t(LS.hello)).toBe('안녕하세요, 이것은 색입니다.')
  })

  test('airport.t() can translate after locale change', () => {
    const LS = airport.createLS({
      introduce: {
        ko: '안녕하세요, 저는 20살입니다.',
        en: 'Hello, I am 20 years old.',
        'en-GB': 'Hello, I am 20 years old.',
        ja: 'こんにちは、私は20歳です。',
        'jh-CN': '你好，我20岁。',
      },
    })

    expect(airport.t(LS.introduce)).toBe('안녕하세요, 저는 20살입니다.')
    airport.changeLocale('en-GB')
    expect(airport.t(LS.introduce)).toBe('Hello, I am 20 years old.')
    airport.changeLocale('en-KR' as 'en')
    expect(airport.t(LS.introduce)).toBe('Hello, I am 20 years old.')
  })

  test('airport.t() can inject variables with evaluating js expression', () => {
    const LS = airport.createLS({
      hello: {
        ko: '{name}님, 사과 {count}개 주세요.',
        en: '{name}, please give me {count} apple{count === 0 ? "" : "s"}.',
        'en-GB': '{name}, please give me {count} apple{count === 0 ? "" : "s"}.',
        ja: '{name}様、リンゴ{count}個ください。',
        'jh-CN': '{name}先生，请给我{count}个苹果。',
      },
    })

    expect(airport.t(LS.hello, { name: '서준', count: 3 })).toBe('서준님, 사과 3개 주세요.')
    airport.changeLocale('en')
    expect(airport.t(LS.hello, { name: 'Jack', count: 3 })).toBe('Jack, please give me 3 apples.')
  })

  test('airport.t() can inject variables with evaluating nested js expression', () => {
    const LS = airport.createLS({
      hello: {
        ko: '{name}님, 사과 {count}개 주세요.',
        en: '{name}, please give me {count} {count > 100 ? "{level}" : ""} apple{count === 0 ? "" : "s"}.',
        'en-GB': '{name}, please give me {count} apple{count === 0 ? "" : "s"}.',
        ja: '{name}様、リンゴ{count}個ください。',
        'jh-CN': '{name}先生，请给我{count}个苹果。',
      },
    })

    airport.changeLocale('en')
    expect(airport.t(LS.hello, { name: 'Jack', level: 'super', count: 120 })).toBe(
      'Jack, please give me 120 super apples.',
    )
  })

  test('airport.t() can inject variables when key is number', () => {
    const LS = airport.createLS({
      hello: {
        ko: '{0}님, 안녕하세요.',
        en: 'Hello, {0}.',
        'en-GB': 'Hello, {0}',
        ja: '{0}さん, こんにちは。',
        'jh-CN': '{0}先生，你好。',
      },
    })

    airport.changeLocale('en')
    expect(airport.t(LS.hello, { 0: 'Mason' })).toBe('Hello, Mason.')
  })

  test('airport.t() can translate options.globalLS', () => {
    expect(airport.t('hello')).toBe('안녕하세요.')

    airport.changeLocale('en-KR' as 'en')

    expect(airport.t('hello')).toBe('Hello.')
  })

  test('airport.t() returns key when key is string and it is not the key of globaLS', () => {
    expect(airport.t('존재하지 않는 키' as 'hello')).toBe('존재하지 않는 키')
  })

  test('airport.t() can use forcedLocale', () => {
    expect(airport.getLocale()).toBe('ko')
    expect(airport.t('hello', null, 'en')).toBe('Hello.')
  })

  test(`airport uses fallbackLocale if current locale doesn't exist`, () => {
    const airport = new Airport({
      supportedLocales,
      globalLS,
      locale: 'ja',
      fallbackLocale: 'ko',
    })
    
    const LS = createPartialLS({
      onlyKoEn: {
        ko: 'korean',
        en: 'english',
      },
    })

    expect(airport.t(LS.onlyKoEn)).toBe('korean')
  })

  test(`airport outputs empty string if both current locale and fallbackLocale don't exist`, () => {
    const airport = new Airport({
      supportedLocales,
      globalLS,
      locale: 'ja',
      fallbackLocale: 'ko',
    })
    
    const LS = createPartialLS({
      onlyEn: {
        en: 'english',
      },
    })

    expect(airport.t(LS.onlyEn)).toBe('')
  })


  
  test('Airport supports partialLS', () => {
    const partialLS = createPartialLS({
      koTest: { ko: '부분 언어 집합' },
      enTest: { en: 'This is english LS'}
    })
    // expect(airport.t(partialLS.koTest)).toBe('부분 언어 집합')
    // expect(airport.t(partialLS.enTest)).toBe(undefined)
    // TODO: Airport partialLS 기능 아직 미완성 상태. 완성 시 테스트 케이스 완성 예정
  })
})
