<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useHappinessStore } from '../stores/happiness'
  import Chart from './Chart.vue'
  import Header from './Header.vue'
  import HappinessEdit from './HappinessEdit/index.vue'

  const store = useHappinessStore()
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

    <HappinessEdit />
  </div>
</template>

<style scoped></style>
