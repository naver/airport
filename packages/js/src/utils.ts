// Airport
// Copyright 2024-present NAVER Corp.
// MIT License

import { LS, PartialLS, RoundingMode } from './types'

/**
 * **createLS wrapper function**
 *
 * @typeParam `T` - Array of supported locales
 * @typeParam `isAllRequired` - Type that determines whether partialLS is supported
 *
 * @example
 * const supportLocales = ['ko', 'en'] as const
 * const createLS = createLSFactory<typeof supportLocales>()
 */
export function createLSFactory<T extends ReadonlyArray<string>, isAllRequired extends Boolean = true>() {
  return function createLS<L extends isAllRequired extends true ? LS<T> : PartialLS<T>>(ls: L): L {
    return ls
  }
}

const offsetRegEx = new RegExp(/[+-]\d\d:?\d\d|Z/)

// Deep compare function to determine whether NumberFormat instance has an option change
// Caution - this function is not considering all the common deep comparison cases of javascript
export function deepEqual(obj1: any, obj2: any) {
  if (Number.isNaN(obj1) && Number.isNaN(obj2)) {
    return true
  }

  if (typeof obj1 !== typeof obj2) {
    return false
  }

  if (typeof obj1 !== 'object' || typeof obj2 != 'object' || obj1 === null || obj2 === null) {
    return obj1 === obj2
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  if (keys1.length !== keys2.length) {
    return false
  }

  for (let key of keys1) {
    if (!deepEqual(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}

// Revaluating functions to support the 'roundingMode' option
export function roundOperation(originNumber: number, adjustedNumber: number, roundingMode: RoundingMode): number {
  const reAdjustmentDiffNumber = 10 ** (Math.floor(Math.log10(Math.abs(originNumber - adjustedNumber))) + 1)

  if (roundingMode === 'ceil' && adjustedNumber <= originNumber) {
    return adjustedNumber + reAdjustmentDiffNumber
  }
  if (roundingMode === 'floor' && adjustedNumber >= originNumber) {
    return adjustedNumber - reAdjustmentDiffNumber
  }
  return adjustedNumber
}
