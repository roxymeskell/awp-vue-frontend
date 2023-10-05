<script setup lang="ts">
  import { onMounted, computed } from 'vue'
  import { useHappinessStore } from '../stores/happiness'
  import Chart from './Chart.vue'
  import Header from './Header.vue'
  import HappinessEdit from './HappinessEdit/index.vue'

  const store = useHappinessStore()
  const getHappiness = computed(() => {
    return store.getHappiness
  })

  onMounted(() => {
    store.fetchAllHappiness()
  })
</script>

<template>
  <div class="container">
    <Header />
    <div style="min-height: 450px">
      <Chart/>
    </div>

    <HappinessEdit :happiness="getHappiness" />
  </div>
</template>

<style scoped></style>
