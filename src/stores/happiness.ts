// stores/employeeHappiness.js
import { ChartData } from 'chart.js'
import { defineStore } from 'pinia'
// Import axios to make HTTP requests
import axios from 'axios'
import url from 'url'

export type HappinessData = {
  id?: number
  name?: string
  is_workplace?: boolean
  very_happy: number
  happy: number
  content: number
  unhappy: number
  very_unhappy: number
  very_happy_percent?: number
  happy_percent?: number
  content_percent?: number
  unhappy_percent?: number
  very_unhappy_percent?: number
  very_happy_and_happy_percent?: number
  not_happy_percent?: number
  created_at?: string
  updated_at?: string
}

interface HappinessState {
  happiness: HappinessData[]
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
  }: HappinessData,
  workplaceHidden: boolean = false
) {
  return {
    label: name,
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
    happiness: [] as HappinessData[],
    workplaceHidden: true,
  }),
  getters: {
    getHappiness(state: HappinessState): HappinessData[] {
      return state.happiness
    },
    getHappinessById(state: HappinessState) {
      return (id: number) => state.happiness.find((h) => h.id == id)
    },
    getHappinessChartData(state: HappinessState): ChartData<'bar', any> {
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
        const data = await axios.get(url.resolve(import.meta.env.VITE_BASE_API_ENDPOINT, '/api/happiness'))
        this.happiness = data.data
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
    async fetchHappiness(id: number) {
      try {
        const data = await axios.get(url.resolve(import.meta.env.VITE_BASE_API_ENDPOINT, '/api/happiness/' + id))
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
        console.log(error)
      }
    },
    async updateHappiness(id: number, happinessData: HappinessData) {
      try {
        const data = await axios.put(
          url.resolve(import.meta.env.VITE_BASE_API_ENDPOINT, '/api/happiness/' + id),
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
        console.log(error)
      }
    },
    async createHappiness(happinessData: HappinessData) {
      try {
        const data = await axios.post(
          url.resolve(import.meta.env.VITE_BASE_API_ENDPOINT, '/api/happiness'),
          happinessData
        )
        this.happiness.push(data.data)
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
    async deleteHappiness(id: number) {
      try {
        await axios.delete(url.resolve(import.meta.env.VITE_BASE_API_ENDPOINT, '/api/happiness/' + id))
        this.happiness.splice(
          this.happiness.findIndex((h) => h.id == id),
          1
        )
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
    toggleWorkplace() {
      this.workplaceHidden = !this.workplaceHidden
    },
  },
})

// https://runthatline.com/pinia-typescript-type-state-actions-getters/
// https://blog.logrocket.com/consume-apis-vuex-pinia-axios/#install-pinia-store
