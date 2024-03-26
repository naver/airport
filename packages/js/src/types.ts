// Airport
// Copyright 2024-present NAVER Corp.
// MIT License

import * as dayjs from 'dayjs'

type AtLeastOneRequired<T> = {
  [Key in keyof T]-?: Required<Pick<T, Key>> & Partial<Omit<T, Key>>
}[keyof T];


export interface Options<T extends ReadonlyArray<string>, G extends LS<T> = {}> {
  supportedLocales: T
  locale: T[number]
  fallbackLocale: T[number]
  name?: string
  globalLS?: G
  currency?: LocaleMap<T, CurrencyType>
  currencyFormatValueKey?: string
  currencyFormat?: CurrencyMap<string>
  keyCurrency?: CurrencyType
  exchangeRate?: CurrencyMap<number>
  timezone?: TimezoneType
  timezoneData?: TimezoneDataMap
  localTimezoneOnly?: boolean
}

export type RoundingMode = 'ceil' | 'floor' | 'round'

/**
 * **Extended type to support 'roundingMode' option**
 *
 * roundingMode - this option supports only three modes('ceil', 'floor', 'round')
 */
export interface ImprovedNumberFormatOptions extends Intl.NumberFormatOptions {
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
 * **Map type to store timezone-specific data**
 */
export type TimezoneDataMap = {
  [timezone in TimezoneType]: TimezoneData | number
}

export interface TimezoneData {
  offset: number // e.g. 540 for 'Asia/Seoul'
  history?: null
  dst?: null // DstPeriod | DstPeriod[]
}

export interface DstPeriod {
  start: string // e.g. '2am March 2nd Sunday'
  end: string // e.g. '2am Nomember 1st Sunday'
  offset: number // e.g. 600 for 'Asia/Seoul' 1950 summer
  since?: number
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

export type TimezoneType = Timezone | string
export enum Timezone {
  AsiaSeoul = 'Asia/Seoul',
  AsiaTokyo = 'Asia/Tokyo',
}

export type Datetime = string | number | Date | dayjs.Dayjs

declare function t<T extends ReadonlyArray<string>, G extends LS<T> = {}>(lso: LSO<T>, variableMap?: any, _forcedLocale?: T[number]): string
declare function t<T extends ReadonlyArray<string>, G extends LS<T> = {}>(partialLso: PartialLSO<T>, variableMap?: any, _forcedLocale?: T[number]): string
declare function t<T extends ReadonlyArray<string>, G extends LS<T> = {}>(globalLSKey: keyof G, variableMap?: any, _forcedLocale?: T[number]): string
declare function t<T extends ReadonlyArray<string>, G extends LS<T> = {}>(stringKey: string, variableMap?: any, _forcedLocale?: T[number]): string
declare function t<T extends ReadonlyArray<string>, G extends LS<T> = {}>(lsoOrGlobalLSKey: LSO<T> | keyof G | string, variableMap?: any, _forcedLocale?: T[number]): string

export type AirportT = typeof t
