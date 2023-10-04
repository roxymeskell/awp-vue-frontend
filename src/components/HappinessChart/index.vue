<template>
    <!-- <Bar :data="data" :options="options" :plugins="plugins" ref="chart" /> -->
    <HappinessBarChart id="happiness" :data="data" :options="options" :plugins="plugins" />
    <!-- <CustomChart id="custom" :data="data" :options="options" :plugins="plugins" /> -->
</template>
  
<script setup lang="ts">
// import CustomChart from './CustomChart.ts';
import { Bar } from 'vue-chartjs'
import { ref, onMounted, computed, withCtx } from 'vue';
import HappinessBarChart from './HappinessBarChart';
import {
Chart as ChartJS,
Title,
BarElement,
LinearScale,
ChartData,
} from 'chart.js';
//   import * as chartConfig from '../chartConfig.js';
// import { objectFormatted as data } from '../data.js';
//   import { drawGradient } from '../chartHelpers.js';

import ChartAreaBorderPlugin from './chartAreaBorderPlugin.ts';
import GradientPlugin from './gradientPlugin.ts';
import { HappinessCategoryScale, ChartLabelsPlugin } from './happinessCategoryScale.ts';

import { useHappinessStore } from '../../stores/happiness'

// defineProps<{ msg: string }>()

// defineProps<{ chartData: ChartData, chartOptions: ChartOptions }>()
const props = defineProps<{ data: ChartData<'bar'> }>()
console.log('VUE CHART', props.data)

// const store = useHappinessStore();
// const data = computed(() => {
//     return { datasets: store.getHappinessChartData };
// })
// onMounted(() => {
//   store.fetchAllHappiness();
// });

// Registers globally
ChartJS.register(
Title,
// Tooltip,
// Legend,
BarElement,
HappinessCategoryScale,
LinearScale,
// ChartAreaBorderPlugin,
// GradientPlugin,
// Colors
);

//   const chart = ref(null);
//   onMounted(() => {
//     console.log(chart, chart.value, chart.value.chartInstance);
//   });

const plugins = [
    GradientPlugin,
    ChartAreaBorderPlugin,
    // ChartLabelsPlugin
];

// const options = chartConfig.options;
const options: any = { responsive: true, maintainAspectRatio: false };
options.minBarLength = 3;
options.borderRadius = 8;
// options.layout = {
//   padding: { bottom: 50, /*top: 76*/ },
// };
options.scales = {
  x: {
    type: 'happiness-category',
  },
  y: {
        type: 'linear',
        beginAtZero: true,
        ticks: {
          stepSize: 0.25,
          callback: (value: number) => `${value * 100}%`,
        },
        position: 'left',
        min: 0,
        max: 1,
      },
};
options.plugins = {
chartAreaBorder: {
    borderColor: '#BABEC4',
    borderWidth: 1,
    borderRadius: 8,
},
};
// options.datasets = {
//   bar: {
//     borderRadius: 8,
//     categoryPercentage: 0.666,
//   },
// };
// options.borderRadius = 8;
// options.backgroundColor = ({
//   canvas: { chartArea: { top = 100, bottom = 0 } = {} } = {},
//   ...rest
// }) => {
//   // console.log('Getting background', rest);
//   return [
//     drawGradient('#008FCF', '#081E3F', bottom, top),
//     drawGradient('#07B2FF', '#00557B', bottom, top),
//     drawGradient('#24B5BE', '#265B5F', bottom, top),
//     drawGradient('#BBBBBB', '#4F4F4F', bottom, top),
//     drawGradient('#FFA800', '#9A4100', bottom, top),
//     drawGradient('#FF5C00', '#9A4100', bottom, top),
//     drawGradient('#FFA800', '#FF5C00', bottom, top),
//   ];
// };
// const data = chartConfig.data;
// const data = ref<ChartData<'bar'>>({
//   datasets: [],
// });

// :style="myStyles"
// const myStyles = computed(() => {
//   console.log('Get styles');
//   return {
//     height: '100%', //`${/* mutable height */}px`,
//     position: 'relative',
//     background: 'red',
//   };
// });

// onMounted(() => {
//   setInterval(() => {
//     data.value = chartConfig.data; // randomData()
//   }, 3000);
// });


</script>
