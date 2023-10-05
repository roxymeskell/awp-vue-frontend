<template>
  <HappinessBarChart id="happiness" :data="data" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import HappinessBarChart from '../chart/HappinessBarChart'
  import { Chart as ChartJS, Title, BarElement, LinearScale } from 'chart.js'

  import { useHappinessStore } from '../stores/happiness'

  const store = useHappinessStore()
  const data = computed(() => {
    return store.getHappinessChartData
  })

  // Registers globally
  ChartJS.register(Title, BarElement, LinearScale)
</script>
