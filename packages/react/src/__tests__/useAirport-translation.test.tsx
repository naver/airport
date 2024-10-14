// Airport
// Copyright 2024-present NAVER Corp.
// MIT License

import * as React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { useAirport } from '../useAirport'
import { customRender } from './test-utils'

function TestButton() {
  const { t, airport } = useAirport()
  const testLS = airport.createLS({
    buttonTitle: {
      ko: '테스트 버튼',
      en: 'test button',
    },
  })

  return <button>{t(testLS.buttonTitle)}</button>
}

function TestNav() {
  const { t, airport } = useAirport()
  const testLS = airport.createLS({
    navTitle: {
      ko: '테스트 네비게이션 {button} !!',
      en: 'test navigation {button} !!'
    }
  })

  return <nav>{t(testLS.navTitle, { button: <TestButton /> })}</nav>
}

function TestSection() {
  const { t, airport } = useAirport()
  const testLS = airport.createLS({
    sectionTitle: {
      ko: '테스트 섹션 {content} !!',
      en: 'test section {content} !!'
    },
    headline: {
      ko: '헤드라인',
      en: 'headline',
    }
  })

  return <section data-testid="test-section">{t(testLS.sectionTitle, { content: <h1>{t(testLS.headline)}</h1> })}</section>
}

test('translation test (ko)', async () => {
  customRender(<TestButton />, 'ko')
  await screen.findByRole('button')
  expect(screen.getByRole('button')).toHaveTextContent('테스트 버튼')
})

test('translation test (en)', async () => {
  customRender(<TestButton />, 'en')
  await screen.findByRole('button')
  expect(screen.getByRole('button')).toHaveTextContent('test button')
})

test('component parameter support of translation function', async () => {
  customRender(<TestNav />, 'ko')
  await screen.findByRole('navigation')
  expect(screen.getByRole('button')).toHaveTextContent('테스트 버튼')
})

test('element parameter support of translation function', async () => {
  customRender(<TestSection />, 'ko')
  await screen.findByTestId('test-section')
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('헤드라인')
})
