// Airport
// Copyright 2024-present NAVER Corp.
// MIT License

type AtLeastOneRequired<T> = {
  [Key in keyof T]-?: Required<Pick<T, Key>> & Partial<Omit<T, Key>>
}[keyof T]

export interface Options<L extends ReadonlyArray<string>, G extends LS<L> | PartialLS<L>> {
  supportedLocales: L
  locale: L[number]
  fallbackLocale: L[number]
  name?: string
  globalLS?: G
  currency?: LocaleMap<L, CurrencyType>
  currencyFormatValueKey?: string
  currencyFormat?: CurrencyMap<string>
  keyCurrency?: CurrencyType
  exchangeRate?: CurrencyMap<number>
}

export type RoundingMode = 'ceil' | 'floor' | 'round'

/**
 * **Extended type to support 'roundingMode' option**
 *
 * roundingMode - this option supports only three modes('ceil', 'floor', 'round')
 */
export interface ImprovedNumberFormatOptions extends Omit<Intl.NumberFormatOptions, 'roundingMode'> {
  roundingMode?: RoundingMode
}

/**
 * **Map type to store currency-specific values or formats**
 *
 * @typeParam `T` - Specifies the type of value to be used by currency
 */
export type CurrencyMap<T> = {
  [currency in CurrencyType]?: T
}

/**
 * **Map type to store locale-specific values**
 *
 * @typeParam `T` - Array of supported locales
 */
export type LocaleMap<T extends ReadonlyArray<string>, V> = {
  [locale in T[number]]: V
}

/**
 * **LSO aggregation**
 *
 * **This type must consist of LSOs(type that has their own translation phrase by supported locale)**
 *
 * @typeParam `T` - Array of supported locales
 */
export interface LS<T extends ReadonlyArray<string>> {
  [LSID: string]: LSO<T>
}

/**
 * **PartialLSO aggregation**
 *
 * **PartialLS consists of optional LSOs**
 *
 * @typeParam `T` - Array of supported locales
 */
export interface PartialLS<T extends ReadonlyArray<string>> {
  [LSID: string]: PartialLSO<T>
}

/**
 * **Language Set Object type consist of translation phrase by locale**
 *
 * **LSO must have translations for all supported locale**
 *
 * @typeParam `T` - Array of supported locales
 */
export type LSO<T extends ReadonlyArray<string>> = LocaleMap<T, string>

/**
 * **Partial Language Set Object type must have translation for at least one supported locale**
 *
 * @typeParam `T` - Array of supported locales
 */
export type PartialLSO<T extends ReadonlyArray<string>> = AtLeastOneRequired<LocaleMap<T, string>>

export type CurrencyType = Currency | string
export enum Currency {
  KRW = 'KRW',
  JPY = 'JPY',
  USD = 'USD',
}

declare function t<T extends ReadonlyArray<string>, G extends LS<T> = {}>(
  lso: LSO<T>,
  variableMap?: any,
  _forcedLocale?: T[number],
): string
declare function t<T extends ReadonlyArray<string>, G extends LS<T> = {}>(
  partialLso: PartialLSO<T>,
  variableMap?: any,
  _forcedLocale?: T[number],
): string
declare function t<T extends ReadonlyArray<string>, G extends LS<T> = {}>(
  globalLSKey: keyof G,
  variableMap?: any,
  _forcedLocale?: T[number],
): string
declare function t<T extends ReadonlyArray<string>, G extends LS<T> = {}>(
  stringKey: string,
  variableMap?: any,
  _forcedLocale?: T[number],
): string
declare function t<T extends ReadonlyArray<string>, G extends LS<T> = {}>(
  lsoOrGlobalLSKey: LSO<T> | keyof G | string,
  variableMap?: any,
  _forcedLocale?: T[number],
): string

export type AirportT = typeof t
