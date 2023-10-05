<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useHappinessStore } from '@/stores/happiness'
  import Chart from '@/components/Chart.vue'
  import Header from '@/components/Header.vue'
  import DataForm from '@/components/DataForm'

  const store = useHappinessStore()
  onMounted(() => {
    store.fetchAllHappiness()
  })
</script>

<template>
  <div class="container">
    <Header />
    <div style="min-height: 450px">
      <Chart />
    </div>

    <DataForm />
  </div>
</template>

<style scoped></style>
