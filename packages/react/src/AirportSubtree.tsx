// Airport
// Copyright 2024-present NAVER Corp.
// MIT License

import { Airport, TimezoneType } from 'airport-js'
import * as React from 'react'

import { AirportContext } from './AirportProvider'
import { useAirport } from './useAirport'

export interface Props {
  locale: string
  children: React.ReactNode
  name?: string
  timezone?: TimezoneType
}

/**
 * **Airport context provider wrapper to apply separate locale from the global AirportProvider**
 */
export function AirportSubtree({ locale, name, timezone, children }: Props) {
  const [_, forceUpdate] = React.useReducer(x => x + 1, () => 0)
  const { initialOptions,  } = useAirport()
  const localOptions = React.useMemo(() => {
    const options = {
      ...initialOptions,
      name,
      locale: locale,
    }

    if (timezone) {
      options.timezone = timezone
    }

    return Object.freeze(options)
  }, [initialOptions])
  const subtreeAirportInstance = React.useMemo(() => {
    return new Airport(localOptions)
  }, [localOptions])
  const setLocale = React.useCallback((locale: string) => {
    subtreeAirportInstance.changeLocale(locale)
    forceUpdate()
  }, [subtreeAirportInstance])
  const setTimezone = React.useCallback((timezone: TimezoneType) => {
    subtreeAirportInstance.changeTimezone(timezone)
    forceUpdate()
  }, [subtreeAirportInstance])

  React.useEffect(() => {
    if (!locale) return
    if (subtreeAirportInstance.getLocale() !== locale) {
      setLocale(locale)
    }
  }, [locale])

  return <AirportContext.Provider value={{
    airport: subtreeAirportInstance,
    initialOptions: localOptions,
    setLocale,
    setTimezone,
  }}>
    {children}
  </AirportContext.Provider>
}
