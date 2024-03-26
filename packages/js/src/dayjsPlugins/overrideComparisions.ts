// Airport
// Copyright 2024-present NAVER Corp.
// MIT License

import { PluginFunc, ConfigType, OpUnitType } from 'dayjs'
import { getLocalDayjs } from '../utils'

const overrideComparisions: PluginFunc = (_option, dayjsClass, dayjsFactory) => {
  
  const oldIsSame = dayjsClass.prototype.isSame
  dayjsClass.prototype.isSame = function(date: ConfigType, unit?: OpUnitType) {
    const instanceTimezone = this.$x.$timezone
    const dayjsLocal = getLocalDayjs(date, dayjsFactory, instanceTimezone)

    if (!unit) {
      return this.valueOf() === dayjsLocal.valueOf()
    }
    
    return oldIsSame.call(this, dayjsLocal, unit)
  }

  const oldDiff = dayjsClass.prototype.diff
  dayjsClass.prototype.diff = function(date: ConfigType, unit?: OpUnitType, float?: boolean) {
    const instanceTimezone = this.$x.$timezone
    const dayjsLocal = getLocalDayjs(date, dayjsFactory, instanceTimezone)
    
    return oldDiff.call(this, dayjsLocal, unit, float)
  }

  const oldIsSameOrAfter = dayjsClass.prototype.isSameOrAfter
  dayjsClass.prototype.isSameOrAfter = function(date: ConfigType, unit?: OpUnitType) {
    const instanceTimezone = this.$x.$timezone
    const dayjsLocal = getLocalDayjs(date, dayjsFactory, instanceTimezone)

    if (!unit) {
      return this.valueOf() >= dayjsLocal.valueOf()
    }
    
    return oldIsSameOrAfter.call(this, dayjsLocal, unit)
  }

  const oldIsAfter = dayjsClass.prototype.isAfter
  dayjsClass.prototype.isAfter = function(date: ConfigType, unit?: OpUnitType) {
    const instanceTimezone = this.$x.$timezone
    const dayjsLocal = getLocalDayjs(date, dayjsFactory, instanceTimezone)

    if (!unit) {
      return this.valueOf() > dayjsLocal.valueOf()
    }
    
    return oldIsAfter.call(this, dayjsLocal, unit)
  }

  const oldIsBefore = dayjsClass.prototype.isBefore
  dayjsClass.prototype.isBefore = function(date: ConfigType, unit?: OpUnitType) {
    const instanceTimezone = this.$x.$timezone
    const dayjsLocal = getLocalDayjs(date, dayjsFactory, instanceTimezone)

    if (!unit) {
      return this.valueOf() < dayjsLocal.valueOf()
    }
    
    return oldIsBefore.call(this, dayjsLocal, unit)
  }

  const oldIsSameOrBefore = dayjsClass.prototype.isSameOrBefore
  dayjsClass.prototype.isSameOrBefore = function(date: ConfigType, unit?: OpUnitType) {
    const instanceTimezone = this.$x.$timezone
    const dayjsLocal = getLocalDayjs(date, dayjsFactory, instanceTimezone)

    if (!unit) {
      return this.valueOf() <= dayjsLocal.valueOf()
    }
    
    return oldIsSameOrBefore.call(this, dayjsLocal, unit)
  }

  const oldIsBetween = dayjsClass.prototype.isBetween
  dayjsClass.prototype.isBetween = function(date1: ConfigType, date2: ConfigType, unit?: OpUnitType, inclusivity?: string) {
    const instanceTimezone = this.$x.$timezone

    const date1Dayjs = getLocalDayjs(date1, dayjsFactory, instanceTimezone)
    const date2Dayjs = getLocalDayjs(date2, dayjsFactory, instanceTimezone)
    
    return oldIsBetween.call(this, date1Dayjs, date2Dayjs, unit, inclusivity)
  }
}

export default overrideComparisions

