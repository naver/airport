// Airport
// Copyright 2024-present NAVER Corp.
// MIT License

import * as React from 'react'
import { LS } from 'airport-js'

import { AirportContext, AirportContextType } from './AirportProvider'

/**
 * **Custom hook for convenient use of airport instance in react**
 *
 * @typeParam `T` - Array of supported locales
 * @typeParam `G` - Type of global language set
 */
export function useAirport<G extends LS<T> = {}, T extends ReadonlyArray<string> = any>() {
  const { airport, initialOptions, setLocale } = React.useContext<AirportContextType<T, G>>(AirportContext as any)
  const [state, setState] = React.useState(getNewAirportState())

  const { t, fn, fc } = airport

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
