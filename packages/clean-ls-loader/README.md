This is a package to use with `airport-js` or `airport-react` to remove unused languages in LS.
- https://www.npmjs.com/package/airport-js
- https://www.npmjs.com/package/airport-react

## Parameters
- `process.env.AIRPORT_CLEAN_LS_FN_NAME`: function name to check LS. Usually the name of the function created using `createLSFactory()`. default is `createLS`
- `process.env.AIRPORT_CLEAN_LS_LANGS_TO_REMOVE`: insert language codes to delete combined with `,`
- `process.env.AIRPORT_CLEAN_LS_DEBUG`: if `true`, before and after of LS will be logged

## Example Usage:
```
AIRPORT_CLEAN_LS_LANGS_TO_REMOVE=ko,en yarn build > build-log.txt
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

## Important Implementation Details

Do not use same type of quote inside the value of LS. It will not be handled and may cause build errors.
```ts
// Wrong ❌
const LS = createLS({
    hello: {
        ko: '안녕하세요 \'준수님\'',
        en: 'Hello \'Junsoo\''
    }
})

// Correct ✅
const LS = createLS({
    hello: {
        ko: "안녕하세요 '준수님'", // You can alternatively use backtick(`)
        en: "Hello 'Junsoo'"
    }
})
```