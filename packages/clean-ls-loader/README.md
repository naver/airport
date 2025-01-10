This is a package to use with `airport-js` or `airport-react` to remove unused languages in LS.

- https://www.npmjs.com/package/airport-js
- https://www.npmjs.com/package/airport-react

## installation

- Make sure you have `typescript` and `webpack` installed in your project

```
npm install -D airport-clean-ls-loader typescript webpack
yarn add -D airport-clean-ls-loader typescript webpack
```

## Parameters

- `process.env.AIRPORT_CLEAN_LS_FN_NAME`: function name to check LS. Usually the name of the function created using `createLSFactory()`. default is `createLS`
- `process.env.AIRPORT_CLEAN_LS_LANGS_TO_REMOVE`: insert language codes to delete combined with `,`

## Example Usage:

```
AIRPORT_CLEAN_LS_LANGS_TO_REMOVE=ko,en yarn build
```

```ts
// next.config.js

const moduleExports = {
  webpack: (config, { isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /\.tsx?$/,
      use: [{ loader: 'airport-clean-ls-loader' }],
    })

    return config
  },
}
```

<!-- ## Important Implementation Details

### Do not use same type of quote inside the value of LS. It will not be handled and may cause build errors.

```ts
// Wrong ❌
const LS = createLS({
  hello: {
    ko: "안녕하세요 '준수님'",
    en: "Hello 'Junsoo'",
  },
})

// Correct ✅
const LS = createLS({
  hello: {
    ko: "안녕하세요 '준수님'", // You can alternatively use backtick(`)
    en: "Hello 'Junsoo'",
  },
})
``` -->
