---
sidebar_position: 1
---
# Introduction
## TypeScript based module

`airport` supports strong typings with Typescript.


## React binding module support

By using `@airport/react`, you can use `Airport` made for React. `Airport` also includes `Subtree` feature that you can use to set separate locale to some part of the component tree.

<img width="100%" alt="Airport Logo" src="https://github.com/naver/airport/blob/main/images/subtree-diagram.png?raw=true"/>


## Code splitting of language set

- Each message is saved in a format called LSO(Language Set Object) and grouped and used as LS(Language Set).
- Save messages in each file where they are used. Then messages will be Code splitted with related components.

```tsx
// Language Set (LS)
const LS = createLS({
  // Language Set Object (LSO)
  hello: {
    ko: '안녕하세요',
    ja: 'こんにちは。',
    en: 'Hello',
  },
  goodbye: {
    ko: '안녕히 가세요.',
    ja: 'さようなら。',
    en: 'Good bye',
  },
})

airport.t(LS.hello)
```

At the time of airport instantiation, you can pass a global LS that can be referenced anywhere in the project. If you use XLT, filtering can be done using LS format and provide it as an instance option.


```tsx
// Static Messages
const globalLS = createLS({
  home: {
    ko: '홈',
    ja: 'ホーム',
    en: 'Home',
  }
})

const airport = new Airport({
  // ...
  globalLS,
})

airport.t('hello')
```

<br/>

## Number/DateTime/Currency format customization based on `Intl`

- Number/DateTime/Currency is formatted using `Intl`
- If you want to customize the format, it can be done manually instead of ICU(International Components for Unicode) or Unicode CLDR(Common Locale Data Repository)


```tsx
airport.fn(1000) // Number formatting with Intl

airport.fd(date) // Date formatting with Intl
airport.fd(date, 'YYYY-MM-DD') // Date formatting with custom format

airport.fc(99000) // Currency formatting. Customized format will be used if passed as an option at instantiation.
```

<br/>

## DateTime handling and Timezone support

- Minimalist JavaScript library, dayjs is used to support Date/Time manipulation and Timezone.

```tsx
const now = airport.dayjs()
const after1hour = now.add(1, 'hour')

airport.fd(date) // Date formatting using timezone specified at the instantiation. Intl format is used
airport.fd(date, 'YYYY-MM-DD') // Date formatting using timezone specified at the instantiation. Custom format is used
airport.fd(date, 'YYYY-MM-DD', 'Asia/Seoul') // Date formatting using timezone passed as the argument. Custom format is used
```

<br/>

## Currency conversion support 

- If you set exchange rate and currency for each locale, currency exchange will be applied with relative format.


```tsx
const airport = new Airport({
  supportedLocales,
  locale: 'ko-KR',
  fallbackLocale: 'ko-KR',
  currency: {
    'ko-KR': Currency.KRW,
    'en-US': Currency.USD,
    'ja-JP': Currency.JPY,
  },
  keyCurrency: Currency.USD, // Standard currency. Default is USD
  exchangeRate: {
    [Currency.USD]: 1,
    [Currency.KRW]: 1135.50,
    [Currency.JPY]: 104.34,
  }
})

// Custom currency Yen is passed
const price = airport.fc(10000, Currenty.JPY) 
// Prints in current locale's currency
console.log(price) // "₩108,827" 
```

<br/>

## VanillaJS support 

You can use Airport without ReactJS. See `Installation > Use airport with vanillaJS`
