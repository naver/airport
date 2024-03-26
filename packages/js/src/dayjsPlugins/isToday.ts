// Airport
// Copyright 2024-present NAVER Corp.
// MIT License

import { PluginFunc } from 'dayjs'
export { ConfigType } from 'dayjs'

declare module 'dayjs' {
  interface Dayjs {
    isToday(): boolean
  }
}

const plugin: PluginFunc = (_option, dayjsClass, dayjsFactory) => {
  dayjsClass.prototype.isToday = function() {
    const comparisonTemplate = 'YYYY-MM-DD'
    const instanceTimezone = this.$x.$timezone

    const now = instanceTimezone ? dayjsFactory().tz(instanceTimezone) : dayjsFactory()

    return this.format(comparisonTemplate) === now.format(comparisonTemplate)
  }
}

export default plugin