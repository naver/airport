---
sidebar_position: 4
---

# Types

> Type `LocaleText` in the guide is equivalent to `T[number]`(`string`) in the source code.

### Options
```tsx
interface Options<T extends ReadonlyArray<string>, G extends LS<T> = {}> {
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
```

### ImprovedNumberFormatOptions
```tsx
interface ImprovedNumberFormatOptions extends Intl.NumberFormatOptions {
  roundingMode?: RoundingMode // 'ceil' | 'floor' | 'round'
}
```

### LocaleMap
```tsx
type LocaleMap<T extends ReadonlyArray<string>, V> = {
  [locale in T[number]]: V
}
```

### CurrencyMap
```ts
type CurrencyMap<T> = {
  [currency in CurrencyType]?: T
}
```

### TimezoneDataMap
```ts
type TimezoneDataMap = {
  [timezone in TimezoneType]: TimezoneData | number
}
```