// Airport
// Copyright 2024-present NAVER Corp.
// MIT License

import * as React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Airport } from 'airport-js'

import { AirportProvider } from '../AirportProvider'

const supportedLocales = ['ko', 'en'] as const
type LocaleType = typeof supportedLocales[number]

export const customRender = (ui: React.ReactElement, locale?: LocaleType, options?: Omit<RenderOptions, 'wrapper'>) => {
  const airport = new Airport({
    supportedLocales,
    locale,
    fallbackLocale: 'ko',
  })

  const DefaultProvider = ({ children }: { children: React.ReactNode }) => (
    <AirportProvider airport={airport}>{children}</AirportProvider>
  )

  return render(ui, { wrapper: DefaultProvider, ...options })
}
