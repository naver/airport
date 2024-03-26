// Airport
// Copyright 2024-present NAVER Corp.
// MIT License

import { PluginFunc, ConfigType } from 'dayjs'
export { ConfigType } from 'dayjs'
import { getLocalDayjs } from '../utils'

declare module 'dayjs' {
  interface Dayjs {
    diffInCalendarYears(date: ConfigType): number
  }
}

const plugin: PluginFunc = (_option, dayjsClass, dayjsFactory) => {
  dayjsClass.prototype.diffInCalendarYears = function(date: ConfigType) {
    const instanceTimezone = this.$x.$timezone
    const localDayjs = getLocalDayjs(date, dayjsFactory, instanceTimezone)

    const year1 = this.year()
    const year2 = localDayjs.year()

    return year1 - year2
  }
}

export default plugin
