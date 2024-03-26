---
sidebar_position: 3
---

# API

### `getOptions()`
Retrieves current airport instance's options.

**Arguments**
- none

**Returns**
- `(Option)`: current instance's option

```ts
const options = airport.getOptions()
```

<!-- -->
### `getLocale()`
Retrieves current locale.

**Arguments**
- none

**Returns**
- `(LocaleText)`: current locale in string

```ts
const locale = airport.getLocale()
```

<!-- -->
### `getLanguage()`
Retrieves current language.

**Arguments**
- none

**Returns**
- `(string)`: current language in string

```ts
const language = airport.getLanguage()
```

<!-- -->
### `getRegion()`
Retrieves current region.

**Arguments**
- none

**Returns**
- `(string)`: current region in string

```ts
const region = airport.getRegion()
```

<!-- -->
### `getDayjsLocaleName()`
Retrieves current locale suited for dayjs format.
locale is converted to lowercase (ex: `en-GB` -> `en-gb`)

**Arguments**
- none

**Returns**
- `(string)`: current locale in string lowercase

```ts
const dayjsLocaleName = airport.getDayjsLocaleName()
```

<!-- -->
### `getTimezone()`
Retrieves current timezone.

**Arguments**
- none

**Returns**
- `(Timezone | string)`: current timezone in string

```ts
const timezone = airport.getTimezone()
```

<!-- -->
### `changeLocale(locale: LocaleText)`
Change locale to desired locale.

**Arguments**
- `locale(LocaleText)`: Any entry in `supportedLocales` to change locale to.

**Returns**
- none

```ts
const newLocale = `ko`
airport.changeLocale(newLocale)
```

<!-- -->
### `changeTimezone(timezone: Timezone | string)`
change timezone to desired timezone.

**Arguments**
- `timezone(Timezone | string)`: any `Timezone` or timezone string to change timezone to.

**Returns**
- none

```ts
const newTimezone = 'Asia/Tokyo'
airport.changeTimezone(newTimezone)
```

<!-- -->
### `t(ls, variableMap?: Record<any,any>, _forcedLocale?: LocaleText)`
Function that selects appropriate text from language set according to current locale. Dynamic values can be applied by passing `variableMap` as a second parameter.

**Arguments**
- `ls` can be any of the types below:
  - `lso(LSO)`: Language Set Object(LSO) that has values for all supported locales.
  - `partialLso(PartialLSO)`: Language Set Object that has values for at least 1 supported locales.
  - `globalLSKey(keyof G)`: key of global Langauge Set Object.
- `variableMap(Record<any,any>)`(optional): Key-value object that has values to substitute from text.
- `_forcedLocale(LocaleText)`(optional): locale to apply instead of current airport instance's locale.

**Returns**
- `(string)`: Current locale's text from `ls`. Returns `''` if current locale entry doesn't exist in `ls`.

```ts
// lso
const createLS = createLSFactory<LocaleType>()
const LS = createLS({
  helloFull: {
    ko: '안녕하세요',
    en: 'Hello',
  },
})
console.log(airport.t(LS.helloFull))

// partialLSO
export const createPartialLS = createLSFactory<LocaleType, false>()
const PartialLS = createPartialLS({
  helloPartial: {
    en: 'Hello',
  }
})
console.log(airport.t(LS.helloPartial))

// globalLSKey
// Assume that airport has been initialized with global LSO that has 'hello' entry.
console.log(airport.t('hello')) 

// dynamic variable
export const createPartialLS = createLSFactory<LocaleType, false>()
const dynamicVarLS = createPartialLS({
  hello: {
    en: 'Hello, {name}',
  }
})
console.log(airport.t(dynamicVarLS.hello, { name: 'Jun' }))

// forced locale
export const createLS = createLSFactory<LocaleType>()
const LS = createLS({
  hello: {
    ko: '안녕하세요',
    en: 'Hello',
  }
})
console.log(airport.t(LS.hello, undefined, 'ko'))
```

<!-- -->
### `fnow(format: string, timezone?: TimezoneType, _forcedLocale?: T[number])`
Returns datetime string with desired format of now.

**Arguments**
- `format(string)`: Dayjs format string.
- `timezone(Timezone | string)`(optional): custom timezone to apply instead of current timezone.
- `_forcedLocale(LocaleText)`(optional): custom locale to apply instead of current locale.

**Returns**
- `(string)`: formatted datetime string of now

```ts
console.log(airport.fnow('YYYY-MM-DDTHH:mm:ssZ'))
```


<!-- -->
### `fd(datetime: Datetime, format?: string, timezone?: TimezoneType, _forcedLocale?: T[number])`
Returns datetime string with desired format of datetime argument.
If format is not specified, `Intl.DateTimeFormat` is used.

**Arguments**
- `datetime(string | number | Date | dayjs.Dayjs)`: datetime to format.
- `format(string)`(optional): Dayjs format string.
- `timezone(Timezone | string)`(optional): custom timezone to apply instead of current timezone.
- `_forcedLocale(LocaleText)`(optional): custom locale to apply instead of current locale.

**Returns**
- `(string)`: formatted datetime string of `datetime` argument

```ts
console.log(airport.fd(new Date(),'YYYY/MM/DD'))
```


<!-- -->
### `fn(value: number, options?: ImprovedNumberFormatOptions, _forcedLocale?: T[number])`
Formats given number value appropriate to current locale

**Arguments**
- `value(number)`: number to format
- `options(ImprovedNumberFormatOptions)`(optional): options for format with extra options added from `Intl.NumberFormatOptions`
- `_forcedLocale(LocaleText)`(optional): custom locale to apply instead of current locale.

**Returns**
- `(string)`: formatted number in current locale's number format.

```ts
console.log(airport.fn(10000))
```


<!-- -->
### `fc(value: number, customFormat?: string, baseCurrency?: Currency, isFixedCurrency = false, _forcedLocale?: T[number])`
Formats given number to current locale's currency.
(Uses `Option.currencyMap`, `Option.currencyFormatValueKey`,`Option.currencyFormat`)

**Arguments**
- `value(number)`: number to format as currency.
- `customFormat(string)`(optional): custom format to apply instead of `Option.currencyFormat`.
- `baseCurrency(Currency)`(optional): currency of `value`. `baseCurrency` is required if `isFixedCurrency` is `true`. 
- `isFixedCurrency(boolean)`(optional): if `isFixedCurrency` is true, `value` will not be exchanged and formatted to current locale's currency. 
- `_forcedLocale(LocaleText)`(optional): custom locale to apply instead of current locale.

**Returns**
- `(string)`: formatted number in current locale's currency.

```ts
// Assume that airport has been constructed with following option:
// 
// locale: 'ko-KR',
// currency: {
//   'ko-KR': 'KRW',
//   'en-US': 'USD',
// },
// currencyFormat: {
//   'USD': 'USD {v}',
//   'KRW': 'KRW {v},  
// },
// keyCurrency: Currency.USD,
// exchangeRate: {
//   [Currency.USD]: 1,
//   [Currency.KRW]: 1000,
// }

// KRW 10,000
console.log(airport.fc(10000)) 
// KRW 10,000,000
console.log(airport.fc(10000, undefined, USD))
// USD 10,000
console.log(airport.fc(10000, undefined, USD, true)) 
```


<!-- -->
### `dayjs(date?: dayjs.ConfigType): dayjs.Dayjs`
- `dayjs(date?: dayjs.ConfigType): dayjs.Dayjs`
- `dayjs(date?: dayjs.ConfigType, _forcedLocale?: T[number]): dayjs.Dayjs`
- `dayjs(date?: dayjs.ConfigType, format?: dayjs.OptionType, strict?: boolean, _forcedLocale?: T[number]): dayjs.Dayjs`
- `dayjs(date?: dayjs.ConfigType, format?: dayjs.OptionType, locale?: string, strict?: boolean, _forcedLocale?: T[number]): dayjs.Dayjs`

Returns `dayjs` object with current locale and timezone.
Same as `dayjs` signature, but with extra argument, `_forcedLocale`.

**Arguments**
- `date(dayjs.ConfigType)`: Same as first argument of dayjs. Supports `Date`, `string`, `dayjs.Dayjs` and more.
- `format(dayjs.OptionType)`(optional): Same as dayjs format string.
- `strict(boolean)`(optional): 
- `locale(string)`(optional): custom locale to apply instead of current locale.
- `_forcedLocale(LocaleText)`(optional): custom locale to apply instead of current locale.
  - **Warning: In 4th signature, `locale` is used instead of `_forcedLocale`**

**Returns**
- `(dayjs.Dayjs)`