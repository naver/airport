// Airport
// Copyright 2024-present NAVER Corp.
// MIT License

import {
  Currency,
  CurrencyMap,
  CurrencyType,
  ImprovedNumberFormatOptions,
  LocaleMap,
  LS,
  LSO,
  Options,
  PartialLS,
  PartialLSO,
  ConditionalLS,
  ConditionalLSO,
} from './types'
import { createLSFactory, deepEqual, roundOperation } from './utils'

/**
 * **Create Airport instance**
 *
 * @typeParam `T` - Array of supported locales
 * @typeParam `G` - Type of global language set
 */
export class Airport<
  isAllRequired extends Boolean = true,
  SupportedLangs extends ReadonlyArray<string> = [],
  GLSType extends ConditionalLS<isAllRequired, SupportedLangs> = ConditionalLS<isAllRequired, SupportedLangs>,
  LSOType extends ConditionalLSO<isAllRequired, SupportedLangs> = ConditionalLSO<isAllRequired, SupportedLangs>
> {
  private locale: SupportedLangs[number]
  private language: string
  private region: string = null

  private fallbackLocale: SupportedLangs[number]
  private fallbackLanguage: string
  private fallbackRegion: string

  private supportedLocales: SupportedLangs
  private globalLS: GLSType

  private currencyMap: LocaleMap<Partial<SupportedLangs>, CurrencyType>
  private supportedCurrency: CurrencyType[] = []
  private currencyFormatValueKey = 'v'
  private currencyFormat: CurrencyMap<string>
  private keyCurrency: CurrencyType = Currency.USD
  private exchangeRate?: CurrencyMap<number>

  private cachedNumberFormat: Intl.NumberFormat
  private cachedNumberFormatOptions: Intl.NumberFormatOptions

  private cachedCurrencyFormat: Intl.NumberFormat
  private cachedCurrencyFormatOptions: Intl.NumberFormatOptions

  constructor(private options: Options<SupportedLangs, GLSType>) {
    this.supportedLocales = options.supportedLocales
    this.globalLS = (options.globalLS ?? {}) as GLSType

    this.setupFallbackLocale(options.fallbackLocale)
    this.setupLocale(options.locale)
    this.setupOptions(options)

    this.t = this.t.bind(this)

    this.cachedNumberFormat = new Intl.NumberFormat(options.locale, this.cachedNumberFormatOptions)
    this.cachedCurrencyFormat = new Intl.NumberFormat(options.locale, this.cachedCurrencyFormatOptions)
  }

  createLS = createLSFactory<SupportedLangs>()

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

  changeLocale = (nextLocale: SupportedLangs[number]) => {
    this.setupLocale(nextLocale)
    this.cachedNumberFormat = new Intl.NumberFormat(nextLocale, this.cachedNumberFormatOptions)
    this.cachedCurrencyFormat = new Intl.NumberFormat(nextLocale, this.cachedCurrencyFormatOptions)
  }

  /**
   * **Function to translate LSO**
   *
   * @param lso - Language set object to translate
   *              For the case of Global LS, pass LS key as string
   * @param [variableMap] - Object that includes variable value used in LSO
   * @param [_forcedLocale] - Locale to use instead of default locale
   */
  t(lso: LSOType, variableMap?: any, _forcedLocale?: SupportedLangs[number]): string
  t(globalLSKey: keyof GLSType, variableMap?: any, _forcedLocale?: SupportedLangs[number]): string
  t(stringKey: string, variableMap?: any, _forcedLocale?: SupportedLangs[number]): string
  t(
    lsoOrGlobalLSKey: LSOType | keyof GLSType | string,
    variableMap?: any,
    _forcedLocale?: SupportedLangs[number],
  ): string
  t(
    lsoOrGlobalLSKey: LSOType | keyof GLSType | string,
    variableMap?: any,
    _forcedLocale?: SupportedLangs[number],
  ): string {
    let translated = ''
    try {
      const locale = _forcedLocale ?? this.getLocale()
      const language = _forcedLocale ? this.splitLocale(_forcedLocale)[0] : this.getLanguage()

      const variableEntries = Object.entries(variableMap ?? {})
      translated =
        typeof lsoOrGlobalLSKey === 'object'
          ? lsoOrGlobalLSKey[locale] ??
            lsoOrGlobalLSKey[language as SupportedLangs[number]] ??
            lsoOrGlobalLSKey[this.fallbackLocale] ??
            lsoOrGlobalLSKey[this.fallbackLanguage as SupportedLangs[number]] ??
            ''
          : this.globalLS[lsoOrGlobalLSKey]?.[locale as SupportedLangs[number]] ??
            this.globalLS[lsoOrGlobalLSKey]?.[language as SupportedLangs[number]] ??
            (lsoOrGlobalLSKey as string)

      // Insert value
      variableEntries.forEach(([key, value]) => {
        if (value === undefined) {
          translated = translated?.replace(new RegExp(`\\{${key}\\}`, 'gi'), '')
        } else {
          translated = translated?.replace(new RegExp(`\\{${key}\\}`, 'gi'), value as string)
        }
      })

      translated = translated?.replace(new RegExp(`\\{(.[^\\}]*)\\}`, 'gi'), (match, p1) => {
        if (Object.keys(variableMap).every(variableKey => !p1?.includes(variableKey))) return match
        return eval(
          `${variableEntries
            .map(([key, value]) => {
              let val = value
              if (typeof val === 'string') {
                val = val.replace(/['"]+/g, '')
              }
              return `var ${key} = ${typeof value === 'string' ? `'${val}'` : value};`
            })
            .join('')}${p1};`,
        )
      })
    } catch (e) {
      console.error(e)
    } finally {
      return translated
    }
  }

  /**
   * **Function to format the given number and return**
   *
   * @param value - Number to format
   * @param [options] - Formatting option to apply. Follows Intl.NumberFormatOptions format
   * @param [_forcedLocale] - Locale to use instead of default locale
   */
  fn = (value: number, options?: ImprovedNumberFormatOptions, _forcedLocale?: SupportedLangs[number]) => {
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
  fc = (
    value: number,
    customFormat?: string,
    baseCurrency?: Currency,
    isFixedCurrency = false,
    _forcedLocale?: SupportedLangs[number],
  ) => {
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

    const exchangedValue = (value / startCurrencyER) * endCurrencyER

    return this.formatCurrency(exchangedValue, currentCurrency, customFormat, _forcedLocale)
  }

  private formatCurrency(
    value: number,
    targetCurrency: CurrencyType,
    customFormat?: string,
    _forcedLocale?: SupportedLangs[number],
  ) {
    let format
    if (customFormat) format = customFormat
    else if (this.currencyFormat?.[targetCurrency]) format = this.currencyFormat?.[targetCurrency]

    return format
      ? this.t(format, { [this.currencyFormatValueKey]: this.fn(value) })
      : this.getCurrencyFormatInstance({ style: 'currency', currency: targetCurrency }, _forcedLocale).format(value)
  }

  private setupLocale(locale: SupportedLangs[number]) {
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

  private setupFallbackLocale(fallbackLocale: SupportedLangs[number]) {
    if (!this.isSupportedLocale(fallbackLocale)) {
      throw new Error('options.fallbackLocale must be value in the options.supportedLocales')
    }

    this.fallbackLocale = fallbackLocale

    const [language, region] = this.splitLocale(fallbackLocale)
    this.fallbackLanguage = language
    this.fallbackRegion = region
  }

  private applyLocale(locale: SupportedLangs[number], language: string, region: string) {
    this.locale = locale
    this.language = language
    this.region = region
  }

  // Function to renew and return cached instance of NumberFormat.
  private getNumberFormatInstance(options?: ImprovedNumberFormatOptions, _forcedLocale?: SupportedLangs[number]) {
    if (_forcedLocale) return new Intl.NumberFormat(_forcedLocale, options)
    if (!deepEqual(this.cachedNumberFormatOptions, options)) {
      this.cachedNumberFormatOptions = options
      this.cachedNumberFormat = new Intl.NumberFormat(this.getLocale(), options)
    }

    return this.cachedNumberFormat
  }

  // Function to renew and return cached instance of CurrencyNumberFormat.
  private getCurrencyFormatInstance(options?: ImprovedNumberFormatOptions, _forcedLocale?: SupportedLangs[number]) {
    if (_forcedLocale) return new Intl.NumberFormat(_forcedLocale, options)
    if (!deepEqual(this.cachedCurrencyFormatOptions, options)) {
      this.cachedCurrencyFormatOptions = options
      this.cachedCurrencyFormat = new Intl.NumberFormat(this.getLocale(), options)
    }

    return this.cachedCurrencyFormat
  }

  private useFallbackLocale() {
    this.applyLocale(this.fallbackLocale, this.fallbackLanguage, this.fallbackRegion)
  }

  private splitLocale(locale: SupportedLangs[number]) {
    return locale.split('-')
  }

  private isSupportedLocale(locale: SupportedLangs[number], language?: string) {
    return this.supportedLocales.includes(locale) || (language && this.supportedLocales.includes(language))
  }

  private setupOptions(options: Options<SupportedLangs, GLSType>) {
    this.setupCurrency(options)
  }

  private setupCurrency(options: Options<SupportedLangs, GLSType>) {
    if (this.currencyMap || !options.currency) return

    this.currencyMap = {
      ...options.currency,
    } as LocaleMap<Partial<SupportedLangs>, Currency>

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
