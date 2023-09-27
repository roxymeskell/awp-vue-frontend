// stores/employeeHappiness.js
import { defineStore } from 'pinia';
// Import axios to make HTTP requests
import axios from 'axios';

export type HappinessData = {
  id?: number;
  team?: string;
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
};


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

export const useEmployeeHappinessStore = defineStore('employeeHappiness',{
  state: () => ({
    employeeHappiness: {
      total: {},
      teams: []
    },
  }),
  getters: {
    getHappinessData(state){
      return [{ team: 'Workplace', ...state.employeeHappiness.total }, ...state.employeeHappiness.teams]
        .map(({ id, team, very_happy, happy, content, unhappy, very_unhappy, created_at, updated_at, ...data}) => { return { data }  });
      // return state.employeeHappiness.teams.map(({ id, name, very_happy, happy, content, unhappy, very_unhappy, ...data}) => ({ data }));
    },
    getHappiness(state){
        return state.employeeHappiness.teams
    },
    getHappinessForTeam(state, id){
      return state.employeeHappiness.teams.find((h) => h.id == id)
    },
    getTotalHappiness(state){
      return state.employeeHappiness.total
    },
  },
  actions: {
    async fetchEmployeeHappiness() {
      try {
          // const data = await axios.get('https://jsonplaceholder.typicode.com/users');
          // const data = await axios.get(import.meta.env.EMPLOYEE_HAPPINESS_ENDPOINT);
          const data = await axios.get('http://localhost:8080/api/employeehappiness')
          this.employeeHappiness.total = data.data.total
          this.employeeHappiness.teams = data.data.data
        }
        catch (error) {
          alert(error);
          console.log(error);
      }
    },
    async updateHappiness(id, happinessData:HappinessData) {
      try {
        const data = await axios.put('http://localhost:8080/api/employeehappiness/' + id, happinessData)
        this.employeeHappiness.total = data.data.total
        // Teams really should be an object indexed by id, I think.
        this.employeeHappiness.teams.splice(
          this.employeeHappiness.teams.findIndex((h) => h.id == id), 1, data.data.data
        );
      }
      catch (error) {
        alert(error);
        console.log(error);
      }
    },
    async createHappiness(happinessData:HappinessData) {
      try {
        const data = await axios.post('http://localhost:8080/api/employeehappiness', happinessData)
        this.employeeHappiness.total = data.data.total
        this.employeeHappiness.teams.push(data.data.data)
      }
      catch (error) {
        alert(error);
        console.log(error);
      }
    },
    async deleteHappiness(id) {
      try {
        const data = await axios.delete('http://localhost:8080/api/employeehappiness/' + id)
        this.employeeHappiness.total = data.data.total
        this.employeeHappiness.teams.splice(this.employeeHappiness.teams.findIndex((h) => h.id == id), 1);
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