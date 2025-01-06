// Airport
// Copyright 2024-present NAVER Corp.
// MIT License

import * as React from 'react'

import { Airport, LS, Options, PartialLS } from 'airport-js'

export interface AirportContextType<L extends ReadonlyArray<string>, G extends LS<L> | PartialLS<L>> {
  airport: Airport<L, G>
  initialOptions: Options<L, G>
  setLocale: (locale: L[number]) => void
  subtreeLocale?: L[number]
  setSubtreeLocale?: (nextStrictLocale: L[number]) => void
}

export const AirportContext = (<L extends ReadonlyArray<string>, G extends LS<L> = {}>() =>
  React.createContext<AirportContextType<L, G>>(null))()

export interface Props<L extends ReadonlyArray<string>, G extends LS<L> = {}> extends Partial<Options<L, G>> {
  children: React.ReactNode
  airport?: Airport<L, G>
}

/**
 * **Airport context provider**
 *
 * **Airport provider needs an airport instance to be used in the context**
 */
export function AirportProvider<L extends ReadonlyArray<string>, G extends LS<L> = {}>({
  children,
  airport,
  ...props
}: Props<L, G>) {
  const airportInstance = React.useMemo(() => {
    if (airport) {
      return airport
    }

    return new Airport<L, G>(props as Options<L, G>)
  }, [airport])
  const initialOptions = React.useMemo(() => {
    if (airport) {
      return Object.freeze(airport.getOptions())
    }

    return Object.freeze(props as Options<L, G>)
  }, [airport])
  const [_, forceUpdate] = React.useReducer(
    x => x + 1,
    () => 0,
  )
  const setLocale = React.useCallback(
    (locale: L[number]) => {
      airportInstance.changeLocale(locale)
      forceUpdate()
    },
    [airportInstance],
  )

  React.useEffect(() => {
    if (!props.locale) return
    if (airportInstance.getLocale() !== props.locale) {
      setLocale(props.locale)
    }
  }, [airportInstance, props.locale])

  return (
    <AirportContext.Provider value={{ airport: airportInstance, initialOptions, setLocale }}>
      {children}
    </AirportContext.Provider>
  )
}
