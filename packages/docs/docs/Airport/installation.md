---
sidebar_position: 2
---

# Installation

## Use airport with vanillaJS

### 1. Installation
Using npm:
```bash
npm install airport-js
```
Using yarn:
```bash
yarn add airport-js
```

### 2. Instantiate airport
```ts
const airport = new Airport({ 
  supportedLocales:['ko', 'en'],
  locale:"ko",
  fallbackLocale:"ko",
  currency :{
    ko: 'KRW',
    en: 'USD',
  },
  currencyFormat:{
    KRW: '{price}원',
    USD: '${price}',
  },
  currencyFormatValueKey:'price',
  exchangeRate:{
    USD: 1,
    KRW: 1000,
  },
  timezone:"Asia/Seoul"
})
```



## Use airport with ReactJS

### 1. Installation
Using npm:
```bash
npm install airport-react
```

Using yarn:
```bash
yarn add airport-react
```

### 2. Add Provider to Root Container
```tsx
import * as React from 'react'
import { AirportProvider } from 'airport-react'

import App from './App'

// Declare supportedLocales as const for Typescript typing
const supportedLocales = ['ko', 'ja', 'en'] as const

function Root() {
  return <AirportProvider
    supportedLocales={supportedLocales}
    locale="ko"
    fallbackLocale="ko"
  >
    <App />
  </AirportProvider>
}
```

### 3. use Airport through `useAirport`
```tsx
import * as React from 'react'
import { useAirport } from 'airport-react'

function App() {
  const { setLocale, t, fc, fnow } = useAirport()
  // ...
}
```
