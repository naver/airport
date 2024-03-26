// Airport
// Copyright 2024-present NAVER Corp.
// MIT License

import { PluginFunc, ConfigType } from 'dayjs'
export { ConfigType } from 'dayjs'
import { getLocalDayjs } from '../utils'

declare module 'dayjs' {
  interface Dayjs {
    diffInCalendarMonths(date: ConfigType): number
  }
}

const plugin: PluginFunc = (_option, dayjsClass, dayjsFactory) => {
  dayjsClass.prototype.diffInCalendarMonths = function(date: ConfigType) {
    const instanceTimezone = this.$x.$timezone
    const localDayjs = getLocalDayjs(date, dayjsFactory, instanceTimezone)

    const year1 = this.year()
    const year2 = localDayjs.year()

    const month1 = this.month()
    const month2 = localDayjs.month()

    return (year1 - year2) * 12 + month1 - month2
  }
}

export default plugin