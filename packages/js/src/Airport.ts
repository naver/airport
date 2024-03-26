// Airport
// Copyright 2024-present NAVER Corp.
// MIT License

import * as dayjs from 'dayjs'

import * as utc from 'dayjs/plugin/utc'
import * as isBetween from 'dayjs/plugin/isBetween'
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import * as duration from 'dayjs/plugin/duration'

import customTimezonePlugin from './dayjsPlugins/customTimezonePlugin'
import diffInCalendarDays from './dayjsPlugins/diffInCalendarDays'
import diffInCalendarMonths from './dayjsPlugins/diffInCalendarMonths'
import diffInCalendarYears from './dayjsPlugins/diffInCalendarYears'
import isToday from './dayjsPlugins/isToday'
import overrideComparisions from './dayjsPlugins/overrideComparisions'

import { getDayjsLocales } from './getDayjsLocales'

import { Currency, CurrencyMap, CurrencyType, Datetime, ImprovedNumberFormatOptions, LocaleMap, LS, LSO, Options, PartialLSO, TimezoneType } from './types'
import { checkIsStringWithoutOffset, createLSFactory, deepEqual, getLocalDayjs, roundOperation } from './utils'

const dayjsPlugins = [utc, customTimezonePlugin, isBetween, isSameOrAfter, isSameOrBefore, diffInCalendarDays, diffInCalendarMonths, diffInCalendarYears, isToday, duration, overrideComparisions]
export type __preserveImport__ = typeof utc
                              | typeof isBetween
                              | typeof isSameOrAfter
                              | typeof isSameOrBefore
                              | typeof duration
                              | typeof customTimezonePlugin
                              | typeof diffInCalendarDays
                              | typeof diffInCalendarMonths
                              | typeof diffInCalendarYears
                              | typeof isToday
                              | typeof overrideComparisions

const supportedDayjsLocales = getDayjsLocales()

/**
 * **Create Airport instance**
 *
 * @typeParam `T` - Array of supported locales
 * @typeParam `G` - Type of global language set
 */
export class Airport<T extends ReadonlyArray<string>, G extends LS<T> = {}> {
  private locale: T[number]
  private language: string
  private region: string = null

  private fallbackLocale: T[number]
  private fallbackLanguage: string
  private fallbackRegion: string

  private supportedLocales: T
  private globalLS: G

  private dayjsLocaleMap: LocaleMap<T, string>

  private currencyMap: LocaleMap<Partial<T>, CurrencyType>
  private supportedCurrency: CurrencyType[] = []
  private currencyFormatValueKey = 'v'
  private currencyFormat: CurrencyMap<string>
  private keyCurrency: CurrencyType = Currency.USD
  private exchangeRate?: CurrencyMap<number>
  private timezone: TimezoneType = Intl.DateTimeFormat().resolvedOptions().timeZone
  private localTimezoneOnly: boolean = false

  private cachedNumberFormat: Intl.NumberFormat
  private cachedNumberFormatOptions: Intl.NumberFormatOptions

  private cachedCurrencyFormat: Intl.NumberFormat
  private cachedCurrencyFormatOptions: Intl.NumberFormatOptions

  constructor(private options: Options<T, G>) {
    this.supportedLocales = options.supportedLocales
    this.globalLS = (options.globalLS ?? {}) as G

    this.setupDayjs()
    this.setupFallbackLocale(options.fallbackLocale)
    this.setupLocale(options.locale)
    this.setupOptions(options)

    this.t = this.t.bind(this)
    this.dayjs = this.dayjs.bind(this)

    this.cachedNumberFormat = new Intl.NumberFormat(options.locale, this.cachedNumberFormatOptions)
    this.cachedCurrencyFormat = new Intl.NumberFormat(options.locale, this.cachedCurrencyFormatOptions)
  }

  createLS = createLSFactory<T>()

  getOptions = () => {
    return { ...this.options }
  }

  getLocale = () => {
    return this.locale
  }

  getLanguage = () => {
    return this.language
  }

  getRegion = () => {
    return this.region
  }

  getDayjsLocaleName = () => {
    return this.dayjsLocaleMap[this.locale]
  }

  getTimezone = () => {
    return this.timezone
  }

  changeLocale = (nextLocale: T[number]) => {
    this.setupLocale(nextLocale)
    this.cachedNumberFormat = new Intl.NumberFormat(nextLocale, this.cachedNumberFormatOptions)
    this.cachedCurrencyFormat = new Intl.NumberFormat(nextLocale, this.cachedCurrencyFormatOptions)
  }

  changeTimezone = (timezone: TimezoneType) => {
    this.timezone = timezone

    const timezoneData = dayjs.tz.getTimezoneData(timezone)
    if (!this.localTimezoneOnly && [null, undefined].includes(timezoneData)) {
      dayjs.tz.refreshDTF(timezone)
    }
  }

  /**
   * **Function to translate LSO**
   *
   * @param lso - Language set object to translate
   *              For the case of Global LS, pass LS key as string
   * @param [variableMap] - Object that includes variable value used in LSO
   * @param [_forcedLocale] - Locale to use instead of default locale
   */
  t(lso: LSO<T>, variableMap?: any, _forcedLocale?: T[number]): string
  t(partialLso: PartialLSO<T>, variableMap?: any, _forcedLocale?: T[number]): string
  t(globalLSKey: keyof G, variableMap?: any, _forcedLocale?: T[number]): string
  t(stringKey: string, variableMap?: any, _forcedLocale?: T[number]): string
  t(lsoOrGlobalLSKey: LSO<T> | keyof G | string, variableMap?: any, _forcedLocale?: T[number]): string{
    let translated = ''
    try {
      const locale = _forcedLocale ?? this.getLocale()
      const language = _forcedLocale ? this.splitLocale(_forcedLocale)[0] : this.getLanguage()

      const variableEntries = Object.entries(variableMap ?? {})
      translated =
        typeof lsoOrGlobalLSKey === 'object'
          ? lsoOrGlobalLSKey[locale] ?? 
          lsoOrGlobalLSKey[language as T[number]] ?? 
          lsoOrGlobalLSKey[this.fallbackLocale] ?? 
          lsoOrGlobalLSKey[this.fallbackLanguage  as T[number]] ?? 
          ''
          : this.globalLS[lsoOrGlobalLSKey]?.[locale as T[number]] ??
            this.globalLS[lsoOrGlobalLSKey]?.[language as T[number]] ??
            (lsoOrGlobalLSKey as string)

      // Insert value
      variableEntries.forEach(([key, value]) => {
        if (value === undefined) {
          translated = translated?.replace(new RegExp(`\\{${key}\\}`, 'gi'), '')
        } else {
          translated = translated?.replace(new RegExp(`\\{${key}\\}`, 'gi'), value as string)
        }
      })

      translated = translated?.replace(new RegExp(`\\{(.[^\\}]*)\\}`, 'gi'), (_match, p1) =>
        // tslint:disable-next-line
        eval(
          `${variableEntries
            .map(([key, value]) => {
              let val = value
              if (typeof val === 'string') {
                val = val.replace(/['"]+/g, '')
              }
              return `var ${key} = ${typeof value === 'string' ? `'${val}'` : value};`
            })
            .join('')}${p1};`,
        ),
      )
    } catch (e) {
      console.error(e)
    } finally {
      return translated
    }
  }

  /**
   * **Function to format current datetime and return**
   *
   * @param format - Date format to apply
   * @param [timezone] - Timezone to use instead of default timezone
   * @param [_forcedLocale] - Locale to use instead of default locale
   */
  fnow = (format: string, timezone?: TimezoneType, _forcedLocale?: T[number]) => {
    const usingTimezone = timezone ?? this.timezone

    if (_forcedLocale) {
      const locale = this.getDayjsLocale(_forcedLocale)
      return this.dnow(usingTimezone).locale(locale).format(format)
    }
    return this.dnow(usingTimezone).format(format)
  }

  /**
   * **Function to format the given datetime and return**
   *
   * @param datetime - Date and time to format
   * @param [format] - Date format to apply (default: 'YYYY-MM-DDTHH:mm:ssZ')
   * @param [timezone] - Timezone to use instead of default timezone
   * @param [_forcedLocale] - Locale to use instead of default locale
   */
  fd = (datetime: Datetime, format?: string, timezone?: TimezoneType, _forcedLocale?: T[number]) => {
    const usingTimezone = timezone ?? this.timezone

    if (!format && (typeof datetime === 'number' || datetime instanceof Date)) {
      if (this.localTimezoneOnly) {
        return this.fdi(datetime, {}, _forcedLocale)
      }
      return this.fdi(datetime, { timeZone: usingTimezone }, _forcedLocale)
    }

    if (_forcedLocale) {
      const locale = this.getDayjsLocale(_forcedLocale)
      return this.d(datetime, usingTimezone).locale(locale).format(format)
    }
    return this.d(datetime, usingTimezone).format(format)
  }

  /**
   * **Function to format the given number and return**
   *
   * @param value - Number to format
   * @param [options] - Formatting option to apply. Follows Intl.NumberFormatOptions format
   * @param [_forcedLocale] - Locale to use instead of default locale
   */
  fn = (value: number, options?: ImprovedNumberFormatOptions, _forcedLocale?: T[number]) => {
    const numberFormat = this.getNumberFormatInstance(options, _forcedLocale)

    if (options?.roundingMode) {
      const adjustedNumber = Number(numberFormat.format(value).replace(/[^0-9.\-]/g, ''))
      const roundingModeNumber = roundOperation(value, adjustedNumber, options.roundingMode)
      return numberFormat.format(roundingModeNumber)
    }

    return numberFormat.format(value)
  }

  /**
   * **Function to convert and format the currency of given value and return**
   *
   * @param value - Number to format
   * @param [customFormat] - Currency Format to apply (default: currencyFormat provided in constructor)
   * @param [baseCurrency] - Currency of `value`. 
   *                         `baseCurrency` is required if `isFixedCurrency` is `true`. 
   * @param [isFixedCurrency] - If `isFixedCurrency` is true, `value` will not be exchanged and formatted to current locale's currency. 
   * @param [_forcedLocale] - Locale to use instead of default locale
   */
  fc = (value: number, customFormat?: string, baseCurrency?: Currency, isFixedCurrency = false, _forcedLocale?: T[number]) => {
    if (!this.currencyMap) {
      console.error('You need to set "currency" options for using fc()')
      return
    }

    const locale = _forcedLocale ?? this.getLocale()

    if (isFixedCurrency) {
      if (!baseCurrency) {
        console.error('You cannot fix currency without baseCurrency.')
        return
      }
      return this.formatCurrency(value, baseCurrency, customFormat, _forcedLocale)
    }

    const currentCurrency = this.currencyMap[locale]
    if (!baseCurrency || baseCurrency === currentCurrency) {
      return this.formatCurrency(value, currentCurrency, customFormat, _forcedLocale)
    }

    const keyCurrencyER = this.exchangeRate[this.keyCurrency]
    const startCurrencyER = this.exchangeRate[baseCurrency] / keyCurrencyER
    const endCurrencyER = this.exchangeRate[currentCurrency] / keyCurrencyER

    if (!startCurrencyER || !endCurrencyER) {
      return this.formatCurrency(value, baseCurrency, customFormat, _forcedLocale)
    }

    const exchangedValue = (value / (startCurrencyER)) * endCurrencyER

    return this.formatCurrency(exchangedValue, currentCurrency, customFormat, _forcedLocale)
  }

  /**
   * **Day.js function embedded into Airport**
   *
   * **It has the same format as Day.js**
   *
   * https://day.js.org/docs/en/installation/installation
   *
   * @returns Day.js wrapper object
   */
  // 4th case uses locale instead of forcedLocale
  // But forcedLocale is kept to stick to the convention of passing forcedLocale as the last parameter
  dayjs(date?: dayjs.ConfigType): dayjs.Dayjs
  dayjs(date?: dayjs.ConfigType, _forcedLocale?: T[number]): dayjs.Dayjs
  dayjs(date?: dayjs.ConfigType, format?: dayjs.OptionType, strict?: boolean, _forcedLocale?: T[number]): dayjs.Dayjs
  dayjs(date?: dayjs.ConfigType, format?: dayjs.OptionType, locale?: string, strict?: boolean, _forcedLocale?: T[number]): dayjs.Dayjs
  dayjs(date?: dayjs.ConfigType, formatOrForcedLocale?: T[number] | dayjs.OptionType, strictOrLocale?: boolean | string, _forcedLocaleOrStrict?: T[number] | boolean) {
    if (this.localTimezoneOnly) {
      return this.dayjsLocal(date, formatOrForcedLocale, strictOrLocale, _forcedLocaleOrStrict)
    }

    // If date doesn't include offset in its string, use locale offset
    if (checkIsStringWithoutOffset(date)) {
      return this._dayjs(date, formatOrForcedLocale, strictOrLocale, _forcedLocaleOrStrict, true)
    }
    return this._dayjs(date, formatOrForcedLocale, strictOrLocale, _forcedLocaleOrStrict)
  }

  private getUniversalDate(date: dayjs.ConfigType) {
    if (typeof date !== 'string') {
      return date
    }
    return date
  }

  private _dayjs(date?: dayjs.ConfigType, formatOrForcedLocale?: T[number] | dayjs.OptionType, strictOrLocale?: boolean | string, _forcedLocaleOrStrict?: T[number] | boolean, keepLocalTime = false) {
    const usingDate = this.getUniversalDate(date)

    if (!formatOrForcedLocale) {
      return dayjs(usingDate).tz(this.timezone, keepLocalTime)
    } else if (typeof formatOrForcedLocale === 'string') {
      const locale = this.getDayjsLocale(formatOrForcedLocale)
      return dayjs(usingDate).tz(this.timezone, keepLocalTime).locale(locale)
    }

    if (!['boolean', 'string'].includes(typeof strictOrLocale)) {
      return dayjs(usingDate, formatOrForcedLocale).tz(this.timezone, keepLocalTime)
    }

    if (!['boolean', 'string'].includes(typeof _forcedLocaleOrStrict)){
      return dayjs(usingDate, formatOrForcedLocale, strictOrLocale as boolean).tz(this.timezone, keepLocalTime)
    } else if (typeof _forcedLocaleOrStrict === 'string') {
      const locale = this.getDayjsLocale(_forcedLocaleOrStrict)
      return dayjs(usingDate, formatOrForcedLocale, strictOrLocale as boolean).tz(this.timezone, keepLocalTime).locale(locale)
    } else {
      return dayjs(usingDate, formatOrForcedLocale, strictOrLocale as string, _forcedLocaleOrStrict).tz(this.timezone, keepLocalTime)
    }
  }

  private dayjsLocal(date?: dayjs.ConfigType, formatOrForcedLocale?: T[number] | dayjs.OptionType, strictOrLocale?: boolean | string, _forcedLocaleOrStrict?: T[number] | boolean) {
    if (!formatOrForcedLocale) {
      return dayjs(date)
    } else if (typeof formatOrForcedLocale === 'string') {
      const locale = this.getDayjsLocale(formatOrForcedLocale)
      return dayjs(date).locale(locale)
    }

    if (!['boolean', 'string'].includes(typeof strictOrLocale)) {
      return dayjs(date, formatOrForcedLocale)
    }

    if (!['boolean', 'string'].includes(typeof _forcedLocaleOrStrict)){
      return dayjs(date, formatOrForcedLocale, strictOrLocale as boolean)
    } else if (typeof _forcedLocaleOrStrict === 'string') {
      const locale = this.getDayjsLocale(_forcedLocaleOrStrict)
      return dayjs(date, formatOrForcedLocale, strictOrLocale as boolean).locale(locale)
    } else {
      return dayjs(date, formatOrForcedLocale, strictOrLocale as string, _forcedLocaleOrStrict)
    }
  }

  private dnow(timezone?: TimezoneType) {
    if (this.localTimezoneOnly) {
      return dayjs()
    }
    return dayjs().tz(timezone)
  }

  private d(date?: dayjs.ConfigType, timezone?: TimezoneType) {
    if (this.localTimezoneOnly) {
      return dayjs(date)
    }
    return getLocalDayjs(date, dayjs, timezone)
  }

  private formatCurrency(value: number, targetCurrency: CurrencyType, customFormat?: string, _forcedLocale?: T[number]) {
    let format
    if (customFormat) format = customFormat
    else if (this.currencyFormat?.[targetCurrency]) format = this.currencyFormat?.[targetCurrency]

    return format
      ? this.t(format, { [this.currencyFormatValueKey]: this.fn(value) })
      : this.getCurrencyFormatInstance({ style: 'currency', currency: targetCurrency }, _forcedLocale).format(value)
  }

  // format datetime via Intl
  private fdi(datetime: number | Date, options?: Intl.DateTimeFormatOptions, _forcedLocale?: T[number]) {
    const fdiOptions = options ?? {}

    if (_forcedLocale) {
      return new Intl.DateTimeFormat(_forcedLocale, fdiOptions).format(datetime)
    }
    return new Intl.DateTimeFormat(this.getLocale(), fdiOptions).format(datetime)
  }

  private setupLocale(locale: T[number]) {
    if (!locale) {
      console.error('There is no input locale.')
      return
    }

    const [language, region] = this.splitLocale(locale)

    if (!this.isSupportedLocale(locale, language)) {
      this.useFallbackLocale()
      return
    }

    this.applyLocale(locale, language, region)
  }

  private setupFallbackLocale(fallbackLocale: T[number]) {
    if (!this.isSupportedLocale(fallbackLocale)) {
      throw new Error('options.fallbackLocale must be value in the options.supportedLocales')
    }

    this.fallbackLocale = fallbackLocale

    const [language, region] = this.splitLocale(fallbackLocale)
    this.fallbackLanguage = language
    this.fallbackRegion = region
  }

  private applyLocale(locale: T[number], language: string, region: string) {
    this.locale = locale
    this.language = language
    this.region = region

    const nextDayjsLocale = this.getDayjsLocale(locale)
    dayjs.locale(nextDayjsLocale)
  }

  // Function to renew and return cached instance of NumberFormat.
  private getNumberFormatInstance(options?: ImprovedNumberFormatOptions, _forcedLocale?: T[number]) {
    if (_forcedLocale) return new Intl.NumberFormat(_forcedLocale, options)
    if (!deepEqual(this.cachedNumberFormatOptions, options)) {
      this.cachedNumberFormatOptions = options
      this.cachedNumberFormat = new Intl.NumberFormat(this.getLocale(), options)
    }

    return this.cachedNumberFormat
  }

  // Function to renew and return cached instance of CurrencyNumberFormat.
  private getCurrencyFormatInstance(options?: ImprovedNumberFormatOptions, _forcedLocale?: T[number]) {
    if (_forcedLocale) return new Intl.NumberFormat(_forcedLocale, options)
    if (!deepEqual(this.cachedCurrencyFormatOptions, options)) {
      this.cachedCurrencyFormatOptions = options
      this.cachedCurrencyFormat = new Intl.NumberFormat(this.getLocale(), options)
    }

    return this.cachedCurrencyFormat
  }

  private getDayjsLocale(locale: T[number]) {
    return this.dayjsLocaleMap[locale] ?? this.dayjsLocaleMap[this.fallbackLocale] ?? 'en'
  }

  private useFallbackLocale() {
    this.applyLocale(this.fallbackLocale, this.fallbackLanguage, this.fallbackRegion)
  }

  private splitLocale(locale: T[number]) {
    return locale.split('-')
  }

  private isSupportedLocale(locale: T[number], language?: string) {
    return this.supportedLocales.includes(locale) || (language && this.supportedLocales.includes(language))
  }

  private setupDayjs() {
    dayjsPlugins.forEach(plugin => dayjs.extend(plugin))

    if (this.dayjsLocaleMap) return

    this.dayjsLocaleMap = this.supportedLocales.reduce((acc, locale: T[number]) => {
      const [language] = this.splitLocale(locale)
      // en-GB needs to be converted to en-gb.
      // language is always lowercase.
      const lowercasedLocaleForDayjs = locale.toLowerCase()
      if (supportedDayjsLocales.includes(lowercasedLocaleForDayjs as any)) {
        acc[locale] = lowercasedLocaleForDayjs
      } else if (supportedDayjsLocales.includes(language as any)) {
        acc[locale] = language
      } else {
        acc[locale] = 'en'
      }
      require(`dayjs/locale/${acc[locale]}.js`)
      return acc
    }, {} as LocaleMap<T, string>)
  }

  private setupOptions(options: Options<T, G>) {
    if (typeof options.localTimezoneOnly === 'boolean') {
      this.localTimezoneOnly = options.localTimezoneOnly
    }
    if (options.timezone) {
      this.timezone = options.timezone
      if (!this.localTimezoneOnly && !Object.keys(options.timezoneData ?? {}).includes(options.timezone)) {
        dayjs.tz.refreshDTF(options.timezone)
      }
    }
    if (options.timezoneData) {
      dayjs.tz.useTimezoneData(options.timezoneData)
    }
    this.setupCurrency(options)
  }

  private setupCurrency(options: Options<T, G>) {
    if (this.currencyMap || !options.currency) return

    this.currencyMap = {
      ...options.currency,
    } as LocaleMap<Partial<T>, Currency>

    this.supportedCurrency = [...Object.values(this.currencyMap)] as Currency[]

    if (options.keyCurrency) {
      this.keyCurrency = options.keyCurrency
    }

    if (!this.supportedCurrency.includes(this.keyCurrency)) {
      throw new Error('keyCurrency must be included on the options.currency.')
    }

    if (options.currencyFormatValueKey) {
      this.currencyFormatValueKey = options.currencyFormatValueKey
    }

    if (options.currencyFormat) {
      this.currencyFormat = {
        ...options.currencyFormat,
      }
    }

    if (options.exchangeRate) {
      this.exchangeRate = {
        ...options.exchangeRate,
      }

      this.exchangeRate[this.keyCurrency] ??= 1
    }
  }
}
