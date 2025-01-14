// Airport
// Copyright 2024-present NAVER Corp.
// MIT License

import * as React from 'react'
import { LS, LSO, PartialLSO, PartialLS } from 'airport-js'

import { AirportContext, AirportContextType } from './AirportProvider'

/**
 * **Custom hook for convenient use of airport instance in react**
 *
 * @typeParam `T` - Array of supported locales
 * @typeParam `G` - Type of global language set
 */
export function useAirport<L extends ReadonlyArray<string>, G extends LS<L> | PartialLS<L>>() {
  const { airport, initialOptions, setLocale } = React.useContext<AirportContextType<L, G>>(AirportContext as any)
  const [state, setState] = React.useState(getNewAirportState())

  const { fn, fc } = airport

  React.useEffect(() => {
    if (state.locale !== airport.getLocale()) {
      setState(getNewAirportState())
    }
  })

  function getNewAirportState() {
    return {
      locale: airport ? airport.getLocale() : null,
      language: airport ? airport.getLanguage() : null,
      region: airport ? airport.getRegion() : null,
    }
  }

  function getTranslationElements(
    translated: string,
    elementVarEntries: [string, any][],
    entriesIdx: number,
  ): React.ReactNode[] {
    if (entriesIdx === elementVarEntries.length) return [translated]

    const key = elementVarEntries[entriesIdx][0]
    const element = elementVarEntries[entriesIdx][1]
    const parts = translated.split(new RegExp(`\\{${key}\\}`, 'gi'))
    const result: React.ReactNode[] = []

    parts.forEach((part, index) => {
      const splitPart = getTranslationElements(part, elementVarEntries, entriesIdx + 1)
      result.push(...splitPart)
      if (index < parts.length - 1) {
        result.push(element)
      }
    })

    return result
  }

  function t(lso: LSO<L>, variableMap?: any, _forcedLocale?: L[number]): string
  function t(partialLso: PartialLSO<L>, variableMap?: any, _forcedLocale?: L[number]): string
  function t(globalLSKey: keyof G, variableMap?: any, _forcedLocale?: L[number]): string
  function t(stringKey: string, variableMap?: any, _forcedLocale?: L[number]): string
  function t(
    lsoOrGlobalLSKey: LSO<L> | PartialLSO<L> | keyof G | string,
    variableMap?: any,
    _forcedLocale?: L[number],
  ): string | React.ReactNode {
    const elementVarEntries = Object.entries(variableMap ?? {}).filter(([_, value]) => React.isValidElement(value))

    if (elementVarEntries.length) {
      const nonElementVariableMap = Object.fromEntries(
        Object.entries(variableMap ?? {}).filter(([_, value]) => !React.isValidElement(value)),
      )
      const nonElementTranslation = airport.t(lsoOrGlobalLSKey as any, nonElementVariableMap, _forcedLocale)

      const translationElements = getTranslationElements(nonElementTranslation, elementVarEntries, 0)
      return (
        <>
          {translationElements.map((element, index) => (
            <React.Fragment key={index}>{element}</React.Fragment>
          ))}
        </>
      )
    }

    return airport.t(lsoOrGlobalLSKey as any, variableMap, _forcedLocale)
  }

  return {
    airport,
    initialOptions,
    setLocale,
    t,
    fn,
    fc,
    ...state,
  }
}
