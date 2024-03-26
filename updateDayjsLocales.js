// Airport
// Copyright 2024-present NAVER Corp.
// MIT License

const fs = require('fs').promises
const path = require('path')

async function main() {
  const files = await fs.readdir(path.join(__dirname, '/node_modules/dayjs/locale'))
  const localesString = files
  .filter(filename => !['x-pseudo.js', 'index.d.ts', 'types.d.ts'].includes(filename))
  .map(filename => `'${filename.replace('.js', '')}'`)
  .join(', ')

  const targetPath = path.join(__dirname, 'packages/js/src/getDayjsLocales.ts')
  await fs.writeFile(targetPath,
`// This file is auto-generated by updateDayjsLocales.js
// Don't modify this file directly. Use script.
    
// https://github.com/iamkun/dayjs/tree/master/src/locale
export function getDayjsLocales() {
  return [${localesString}] as const
}`
    )
  console.log(`Complete creating file ${targetPath}.`)
}

main()