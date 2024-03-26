// Airport
// Copyright 2024-present NAVER Corp.
// MIT License

import { PluginFunc, ConfigType } from 'dayjs'
export { ConfigType } from 'dayjs'
import { getLocalDayjs } from '../utils'

declare module 'dayjs' {
  interface Dayjs {
    diffInCalendarDays(date: ConfigType): number
  }
}

const plugin: PluginFunc = (_option, dayjsClass, dayjsFactory) => {
  dayjsClass.prototype.diffInCalendarDays = function(date: ConfigType) {
    const instanceTimezone = this.$x.$timezone
    const date1 = this.startOf('day')
    const date2 = getLocalDayjs(date, dayjsFactory, instanceTimezone).startOf('day')

    return date1.diff(date2, 'day')
  }
}

export default plugin