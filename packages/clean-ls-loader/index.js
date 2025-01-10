const ts = require('typescript')

/**
 *
 * createLS(
 *  { // lsNode
 *    test: { // lsFieldNode
 *      en: 'test', // langNode
 *    },
 *  }
 * )
 */

module.exports = function (source) {
  if (!process.env.AIRPORT_CLEAN_LS_LANGS_TO_REMOVE) return source
  if (source.indexOf('createLS') === -1) return source

  const fnName = process.env.AIRPORT_CLEAN_LS_FN_NAME ?? 'createLS'
  const langsToRemove = process.env.AIRPORT_CLEAN_LS_LANGS_TO_REMOVE.split(',')

  // Transformer function to modify the AST
  const transformer = context => {
    const visit = node => {
      // Check if node is a call expression: createLS({...})
      if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression?.text === fnName &&
        node.arguments.length === 1 &&
        ts.isObjectLiteralExpression(node.arguments[0])
      ) {
        const lsNode = node.arguments[0]

        const newProperties = lsNode.properties.map(lsFieldNode => {
          if (!ts.isPropertyAssignment(lsFieldNode) || !ts.isObjectLiteralExpression(lsFieldNode.initializer))
            return lsFieldNode

          // Decide whether to remove the langNode
          const cleanedInnerProperties = lsFieldNode.initializer.properties.filter(langNode => {
            if (ts.isPropertyAssignment(langNode) && ts.isIdentifier(langNode.name)) {
              return !langsToRemove.includes(langNode.name?.text)
            }
            return true
          })

          // Return a new property with the cleaned inner object
          const cleaned = ts.factory.updatePropertyAssignment(
            lsFieldNode,
            lsFieldNode.name,
            ts.factory.updateObjectLiteralExpression(lsFieldNode.initializer, cleanedInnerProperties),
          )
          return cleaned
        })

        // Return a new call expression with the modified outer object
        return ts.factory.updateCallExpression(node, node.expression, node.typeArguments, [
          ts.factory.updateObjectLiteralExpression(lsNode, newProperties),
        ])
      }

      // Visit child nodes recursively
      return ts.visitEachChild(node, visit, context)
    }

    return node => ts.visitNode(node, visit)
  }

  // Parse the source code into an AST
  const sourceFile = ts.createSourceFile(this.resourcePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const result = ts.transform(sourceFile, [transformer])
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: false,
  })
  const transformedSource = printer.printFile(result.transformed[0])

  return transformedSource
}
