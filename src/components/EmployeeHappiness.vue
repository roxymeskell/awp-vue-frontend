<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useHappinessStore } from '../stores/happiness'
import Chart from './Chart.vue'
import HappinessChart from './HappinessChart/index.vue'
import HappinessEdit from './HappinessEdit/index.vue'

// defineProps<{ msg: string }>()

const store = useHappinessStore();
// const msg = ref("Welcome to my Vuex Store");
// const happinessData = computed(() => {
//     const happiness = store.getHappiness;
//     happiness.
//   return store.getHappiness;
// });

const happinessData = computed(() => {
    return store.getHappinessChartData;
})
const getHappiness = computed(() => {
  return store.getHappiness;
});
const employeeHappiness = computed(() => {
  return store.happiness;
});
onMounted(() => {
  store.fetchAllHappiness();
});

// https://jasonwatmore.com/post/2022/07/25/vue-3-pinia-user-registration-and-login-example-tutorial#login-vue
// async function onSubmit(values) {
//     const happinessStore = useEmployeeHappinessStore();
//     const { id, very_happy, happy, content, unhappy, very_unhappy } = values;
//     await happinessStore.updateHappiness(id, { very_happy, happy, content, unhappy, very_unhappy });
// }

</script>

<template>
  <div class="card">
      <p>
          {{ happinessData }}
      </p>
      <h2>Made By Getters</h2>
      <div v-for="h in getHappiness" :key="h.id">
        {{ h.id }} {{ h.name }} {{ h.very_happy_and_happy_percent }} {{ h.unhappy_percent }}
      </div>
      <h2>Made By Actions</h2>
      <div v-for="h in employeeHappiness" :key="h.id">
        {{ h.id }} {{ h.name }} {{ h.very_happy_and_happy_percent }} {{ h.unhappy_percent }}
      </div>
    </div>

  <div class="container">
    
    <div style="min-height: 25vh">
      <HappinessChart :data="happinessData" />
    </div>

    <HappinessEdit :happiness="getHappiness" />

  </div>


</template>

<style scoped>

</style>