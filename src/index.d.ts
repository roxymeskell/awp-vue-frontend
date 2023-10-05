import { ChartTypeRegistry } from 'chart.js'

declare module '*.svg'

declare module 'chart.js' {
  interface ChartTypeRegistry {
    'happiness-bar': ChartTypeRegistry['bar']
  }
}
