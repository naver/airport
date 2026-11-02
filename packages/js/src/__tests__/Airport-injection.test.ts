// Airport
// Copyright 2024-present NAVER Corp.
// MIT License

import { Airport } from '../Airport'

const airport = new Airport({ supportedLocales: ['ko', 'en'] as const, fallbackLocale: 'ko', locale: 'ko' })
const { t } = airport

// globalThis.airportPwned is set only when an injected value gets executed
const probe = globalThis as { airportPwned?: number }

describe('Airport.t injection', () => {
  beforeEach(() => {
    delete probe.airportPwned
  })

  afterEach(() => {
    expect(probe.airportPwned).toBeUndefined()
  })

  describe('template syntax', () => {
    it('inserts values into {key}', () => {
      expect(t({ ko: '{name}님 안녕하세요' }, { name: '홍길동' })).toBe('홍길동님 안녕하세요')
    })

    it('evaluates expressions written in the template', () => {
      const lso = { ko: `메뉴 [{isImp ? '노출' : '미노출'}]` }
      expect(t(lso, { isImp: true })).toBe('메뉴 [노출]')
      expect(t(lso, { isImp: false })).toBe('메뉴 [미노출]')
      expect(t({ ko: `취소수수료 {rate === 100 ? '없음' : 100 - rate + '%'}` }, { rate: 30 })).toBe('취소수수료 70%')
    })

    it('fills {key} inside an expression before evaluating it', () => {
      const lso = { ko: `이용 {baseDay ? '{baseDay}' : '1'}일 전` }
      expect(t(lso, { baseDay: 3 })).toBe('이용 3일 전')
      expect(t(lso, { baseDay: 0 })).toBe('이용 1일 전')
      expect(
        t(
          { ko: `{before ? '이용 {before}일 전 {time}시' : ''} ~ 이용 {baseDay}일 전` },
          { before: 2, time: 18, baseDay: 1 },
        ),
      ).toBe('이용 2일 전 18시 ~ 이용 1일 전')
    })
  })

  it('returns a non-string language set as is without throwing', () => {
    expect(t({ ko: ['a'] } as never)).toEqual(['a'])
  })

  describe('values are printed literally and never executed', () => {
    it('does not evaluate {variable,expression} inside a value', () => {
      const lso = { ko: `<em>'{inputValue}'</em>에 대한 검색 결과가 없습니다.` }
      expect(t(lso, { inputValue: '{inputValue,globalThis.airportPwned=1}' })).toBe(
        `<em>'{inputValue,globalThis.airportPwned=1}'</em>에 대한 검색 결과가 없습니다.`,
      )
    })

    it('does not let a value escape the string literal with quotes', () => {
      const name = `' + (globalThis.airportPwned=1) + '`
      expect(t({ ko: `{flag ? '{name}님' : ''}` }, { flag: true, name })).toBe(`${name}님`)
    })

    it('does not let a trailing backslash break the next variable declaration', () => {
      const vars = { a: 'x\\', b: ';globalThis.airportPwned=1//', flag: true }
      expect(t({ ko: `{a} {b} {flag ? 'y' : 'n'}` }, vars)).toBe('x\\ ;globalThis.airportPwned=1// y')
    })

    it('keeps quotes in a value returned by an expression', () => {
      expect(t({ ko: `{name ? name : '-'}` }, { name: `"A" 'B'` })).toBe(`"A" 'B'`)
    })

    it('does not substitute {key} found in a previous value', () => {
      expect(t({ ko: '{a}/{b}' }, { a: '{b}', b: 'X' })).toBe('{b}/X')
    })

    it('does not execute array or object values in eval', () => {
      const list = ['globalThis.airportPwned=1']
      expect(t({ ko: `{flag ? 'y' : 'n'}` }, { flag: true, list })).toBe('y')
      expect(t({ ko: `{list ? list : ''}` }, { list })).toBe('globalThis.airportPwned=1')
    })

    it('does not interpret $ replacement patterns in a value', () => {
      expect(t({ ko: '[{name}]' }, { name: "$&$'" })).toBe("[$&$']")
    })
  })

  describe('Private Use Area characters are kept as they are', () => {
    // U+E000~U+E005, used by some icon fonts and legacy carrier emoji
    const pua = String.fromCharCode(0xe000, 0xe001, 0xe002, 0xe003, 0xe004, 0xe005)

    it('keeps them in a language set without values', () => {
      expect(t({ ko: `${pua} 아이콘` })).toBe(`${pua} 아이콘`)
    })

    it('keeps them in a language set with values', () => {
      expect(t({ ko: `${pua} {name}` }, { name: '홍길동' })).toBe(`${pua} 홍길동`)
    })

    it('keeps them in a value, also inside an expression', () => {
      expect(t({ ko: '[{name}]' }, { name: `a${pua}{b}` })).toBe(`[a${pua}{b}]`)
      expect(t({ ko: `{flag ? '{name}' : ''}` }, { flag: true, name: `${pua}'` })).toBe(`${pua}'`)
    })
  })
})
