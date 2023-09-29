// stores/employeeHappiness.js
import { defineStore } from 'pinia';
// Import axios to make HTTP requests
import axios from 'axios';
import url from 'url';

export type HappinessData = {
  id?: number;
  name?: string;
  is_workplace?: string;
  very_happy: number;
  happy: number;
  content: number;
  unhappy: number;
  very_unhappy: number;
  very_happy_percent?: number;
  happy_percent?: number;
  content_percent?: number;
  unhappy_percent?: number;
  very_unhappy_percent?: number;
  very_happy_and_happy_percent?: number;
  not_happy_percent?: number;
  created_at?: string;
  updated_at?: string;
};

interface HappinessState {
  happiness: HappinessData[];
  // user: UserInfo | null;
}


// const dataBackgroundColor: {
//   backgroundColor: [
//   'rgba(255, 99, 132, 0.2)',
//   'rgba(255, 159, 64, 0.2)',
//   'rgba(255, 205, 86, 0.2)',
//   'rgba(75, 192, 192, 0.2)',
//   'rgba(54, 162, 235, 0.2)',
//   'rgba(153, 102, 255, 0.2)',
//   'rgba(201, 203, 207, 0.2)'
// ],
// }

export const useHappinessStore = defineStore('happiness',{
  state: (): HappinessState => ({
    happiness: [] as HappinessData[],
  }),
  getters: {
    getHappiness(state: HappinessState): HappinessData[] {
        return state.happiness
    },
    getHappinessById(state: HappinessState) {
      return (id: number) => state.happiness.find((h) => h.id == id)
    },
    getHappinessChartData(state: HappinessState) {
      return state.happiness.map(({ id, very_happy, happy, content, unhappy, very_unhappy, created_at, updated_at, ...data}) => { return { data }  });
      // return state.employeeHappiness.teams.map(({ id, name, very_happy, happy, content, unhappy, very_unhappy, ...data}) => ({ data }));
    },
    // getTotalHappiness(state){
    //   return state.employeeHappiness.total
    // },
  },
  actions: {
    async fetchHappiness() {
      try {

          const data = await axios.get(url.resolve(import.meta.env.VITE_BASE_API_ENDPOINT, '/api/happiness'))
          this.happiness = data.data
        }
        catch (error) {
          alert(error);
          console.log(error);
      }
    },
    async updateHappiness(id: number, happinessData: HappinessData) {
      try {
        const data = await axios.put(url.resolve(import.meta.env.VITE_BASE_API_ENDPOINT, '/api/happiness/' + id), happinessData)
        // Should happiness be indexed by id?
        this.happiness.splice(this.happiness.findIndex((h) => h.id == id), 1, data.data);
      }
      catch (error) {
        alert(error);
        console.log(error);
      }
    },
    async createHappiness(happinessData: HappinessData) {
      try {
        const data = await axios.post(url.resolve(import.meta.env.VITE_BASE_API_ENDPOINT, '/api/happiness'), happinessData)
        this.happiness.push(data.data)
      }
      catch (error) {
        alert(error);
        console.log(error);
      }
    },
    async deleteHappiness(id: number) {
      try {
        const data = await axios.delete(url.resolve(import.meta.env.VITE_BASE_API_ENDPOINT, '/api/happiness/' + id))
        this.happiness.splice(this.happiness.findIndex((h) => h.id == id), 1);
      }
      catch (error) {
        alert(error);
        console.log(error);
      }
    },
  },
});

// https://runthatline.com/pinia-typescript-type-state-actions-getters/
// https://blog.logrocket.com/consume-apis-vuex-pinia-axios/#install-pinia-store