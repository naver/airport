// Airport
// Copyright 2024-present NAVER Corp.
// MIT License

import * as React from 'react'

import { Airport, LS, Options, TimezoneType } from 'airport-js'

export interface AirportContextType<T extends ReadonlyArray<string>, G extends LS<T> = {}> {
  airport: Airport<T, G>
  initialOptions: Options<T, G>
  setLocale: (locale: T[number]) => void
  setTimezone: (timezone: TimezoneType) => void
  subtreeLocale?: T[number]
  setSubtreeLocale?: (nextStrictLocale: T[number]) => void
}

export const AirportContext = (<T extends ReadonlyArray<string>, G extends LS<T> = {}>() => React.createContext<AirportContextType<T, G>>(null))();

export interface Props<T extends ReadonlyArray<string>, G extends LS<T> = {}> extends Partial<Options<T, G>> {
  children: React.ReactNode
  airport?: Airport<T, G>
}

/**
 * **Airport context provider**
 *
 * **Airport provider needs an airport instance to be used in the context**
 */
export function AirportProvider<T extends ReadonlyArray<string>, G extends LS<T> = {}>({ children, airport, ...props }: Props<T, G>) {
  const airportInstance = React.useMemo(() => {
    if (airport) {
      return airport
    }

    return new Airport<T, G>(props as Options<T, G>)
  }, [airport])
  const initialOptions = React.useMemo(() => {
    if (airport) {
      return Object.freeze(airport.getOptions())
    }

    return Object.freeze(props as Options<T, G>)
  }, [airport])
  const [_, forceUpdate] = React.useReducer(x => x + 1, () => 0)
  const setLocale = React.useCallback((locale: T[number]) => {
    airportInstance.changeLocale(locale)
    forceUpdate()
  }, [airportInstance])
  const setTimezone = React.useCallback((timezone: TimezoneType) => {
    airportInstance.changeTimezone(timezone)
    forceUpdate()
  }, [airportInstance])

  React.useEffect(() => {
    if (!props.locale) return
    if (airportInstance.getLocale() !== props.locale) {
      setLocale(props.locale)
    }
  }, [airportInstance, props.locale])

  React.useEffect(() => {
    if (!props.timezone) return
    if (airportInstance.getTimezone() !== props.timezone) {
      setTimezone(props.timezone)
    }
  }, [airportInstance, props.timezone])

  return (
    <AirportContext.Provider value={{ airport: airportInstance, initialOptions, setLocale, setTimezone }}>
      {children}
    </AirportContext.Provider>
  )
}
