// stores/employeeHappiness.js
import { defineStore } from 'pinia'
// Import axios to make HTTP requests
import axios from 'axios'
import url from 'url'

import { HappinessChartData, HappinessChartDataset } from '@/chart/HappinessBarChart'

export type HappinessValueKey = 'very_happy' | 'happy' | 'content' | 'unhappy' | 'very_unhappy'
export type HappinessPercentKey = 'very_happy_and_happy_percent' | 'very_happy_percent' | 'happy_percent' | 'content_percent' | 'unhappy_percent' | 'very_unhappy_percent' | 'not_happy_percent'

export type Happiness = {
  id: number
  name?: string
  is_workplace?: boolean
  readonly created_at?: string
  readonly updated_at?: string
} & { [Property in HappinessValueKey]: number }
& { readonly [Property in HappinessPercentKey]?: number }

export type HappinessKey = keyof Happiness

type HappinessUpdateData = Pick<Happiness, 'name' | HappinessValueKey>
type HappinessCreateData = Pick<
  Happiness,
  'name' | 'is_workplace' | HappinessValueKey
>

interface HappinessState {
  happiness: Happiness[]
  workplaceHidden: boolean
  // user: UserInfo | null;
}

/**
 * Transforms data into chart data
 * @param happiness HappinessData
 * @param workplaceHidden boolean
 */
function transformToChartData(
  {
    name,
    is_workplace = false,
    very_happy_and_happy_percent = 0,
    very_happy_percent = 0,
    happy_percent = 0,
    content_percent = 0,
    unhappy_percent = 0,
    very_unhappy_percent = 0,
    not_happy_percent = 0,
  }: Happiness,
  workplaceHidden: boolean = false
): HappinessChartDataset {
  return {
    label: name || '',
    hidden: is_workplace && workplaceHidden,
    data: [
      { x: 'Very Happy + Happy', y: very_happy_and_happy_percent },
      { x: 'Very Happy', y: very_happy_percent },
      { x: 'Happy', y: happy_percent },
      { x: 'Content', y: content_percent },
      { x: 'Unhappy', y: unhappy_percent },
      { x: 'Very Unhappy', y: very_unhappy_percent },
      { x: 'Not Happy', y: not_happy_percent },
    ],
  }
}

export const useHappinessStore = defineStore('happiness', {
  state: (): HappinessState => ({
    happiness: [] as Happiness[],
    workplaceHidden: true,
  }),
  getters: {
    getHappiness(state: HappinessState) {
      return state.happiness
    },
    getHappinessById(state: HappinessState) {
      return (id: number) => state.happiness.find((h) => h.id == id)
    },
    getHappinessChartData(state: HappinessState): HappinessChartData {
      return {
        datasets: state.happiness.map((h) => transformToChartData(h, state.workplaceHidden)),
      }
    },
    getWorkplaceHidden(state: HappinessState): boolean {
      return state.workplaceHidden
    },
    getWorkplaceShow(state: HappinessState): boolean {
      return !state.workplaceHidden
    },
  },
  actions: {
    async fetchAllHappiness() {
      try {
        const data = await axios.get(url.resolve(import.meta.env.VITE_API_BASE_URL, '/api/happiness'))
        this.happiness = data.data
      } catch (error) {
        alert(error)
        console.error(error)
      }
    },
    async fetchHappiness(id: number) {
      try {
        const data = await axios.get(url.resolve(import.meta.env.VITE_API_BASE_URL, '/api/happiness/' + id))
        const index = this.happiness.findIndex((h) => h.id == id)
        if (index != -1) {
          this.happiness.splice(
            this.happiness.findIndex((h) => h.id == id),
            1,
            data.data
          )
        } else {
          this.happiness.push(data.data)
        }
      } catch (error) {
        alert(error)
        console.error(error)
      }
    },
    async updateHappiness(id: number, happinessData: HappinessUpdateData) {
      try {
        const data = await axios.put(
          url.resolve(import.meta.env.VITE_API_BASE_URL, '/api/happiness/' + id),
          happinessData
        )
        // Should happiness be indexed by id?
        this.happiness.splice(
          this.happiness.findIndex((h) => h.id == id),
          1,
          data.data
        )
      } catch (error) {
        alert(error)
        console.error(error)
      }
    },
    async createHappiness(happinessData: HappinessCreateData) {
      try {
        const data = await axios.post(
          url.resolve(import.meta.env.VITE_API_BASE_URL, '/api/happiness'),
          happinessData
        )
        this.happiness.push(data.data)
      } catch (error) {
        alert(error)
        console.error(error)
      }
    },
    async deleteHappiness(id: number) {
      try {
        await axios.delete(url.resolve(import.meta.env.VITE_API_BASE_URL, '/api/happiness/' + id))
        this.happiness.splice(
          this.happiness.findIndex((h) => h.id == id),
          1
        )
      } catch (error) {
        alert(error)
        console.error(error)
      }
    },
    toggleWorkplace() {
      this.workplaceHidden = !this.workplaceHidden
    },
    setHappiness(id: number, key: HappinessValueKey, value: number) {
      try {
        const happiness = this.happiness.find((h) => h.id == id)
        if (!happiness) {
          throw 'Happiness data not found'
        }
        happiness[key] = value
        this.happiness.splice(
          this.happiness.findIndex((h) => h.id == id),
          1,
          happiness
        )
      } catch (error) {
        alert(error)
        console.error(error)
      }
    },
  },
})