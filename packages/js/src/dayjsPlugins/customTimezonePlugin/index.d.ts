import { PluginFunc, ConfigType, OpUnitType } from 'dayjs'
import { TimezoneDataMap, TimezoneType, TimezoneData } from "../../types"

declare const plugin: PluginFunc
export = plugin

declare module 'dayjs' {
  interface Dayjs {
    tz(timezone?: string, keepLocalTime?: boolean): Dayjs
    offsetName(type?: 'short' | 'long'): string | undefined
    // Temp
    $set(string: OpUnitType, int: number): Dayjs
    $x: { $timezone?: TimezoneType, $localOffset?: number }
  }

  interface DayjsTimezone {
    (date: ConfigType, timezone?: string): Dayjs
    (date: ConfigType, format: string | TimezoneType, timezone?: TimezoneType): Dayjs
    guess(): string
    setDefault(timezone?: string): void
    refreshDTF(timezone: TimezoneType): void
    useTimezoneData(timezoneData: TimezoneDataMap): void
    getTimezoneData(timezone: TimezoneType): TimezoneData | number
  }
  
  let tz: DayjsTimezone
}
