import { HappinessDataPoint } from './chart/HappinessBarChart'

declare module '*.svg'

declare module 'chart.js' {
  interface ChartTypeRegistry {
    'happiness-bar': Omit<ChartTypeRegistry['bar'], 'defaultDataPoint'> & {
      defaultDataPoint: HappinessDataPoint | null
    }
  }
}
