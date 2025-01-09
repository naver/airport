module.exports = function (source) {
  if (!process.env.AIRPORT_CLEAN_LS_LANGS_TO_REMOVE) return source

  const fnName = process.env.AIRPORT_CLEAN_LS_FN_NAME ?? 'createLS'
  const langsToRemove = process.env.AIRPORT_CLEAN_LS_LANGS_TO_REMOVE.split(',')
  const isDebugMode = process.env.AIRPORT_CLEAN_LS_DEBUG === 'true'


  const removeSelectedLangsFromObjects = input => {
    let result = input
    langsToRemove.forEach(lang => {
      result = result.replace(
        // Rule1: Match the string starting from whitespace before {lang} but skip comments (//)
        // Rule2: Include value even if its multiline and search for all types of quotes (", ', `)
        // Rule3: Also Include trailing comma, whitespace, and newline
        new RegExp(`^[ \\t]*(?!\\/\\/)${lang}\\s*:\\s*([\\'"\`])([\\s\\S]*?)\\1\\s*,?\\n?`, 'gm'),
        '',
      )
    })
    return result
  }

  const createLSRegex = new RegExp(`${fnName}\\(\\s*(\\{[\\s\\S]*?\\})\\s*\\)`, 'gs')

  const result = source.replace(createLSRegex, (match, createLSParam) => {
    if (isDebugMode) console.log('[Airport - Original]', createLSParam)
    const cleanedParam = removeSelectedLangsFromObjects(createLSParam)
    if (isDebugMode) console.log('[Airport- Cleaned]', cleanedParam)
    return `${fnName}(${cleanedParam})`
  })

  return result
}
