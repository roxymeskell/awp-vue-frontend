<script setup lang="ts">
  import { computed } from 'vue'
  import { useHappinessStore } from '@/stores/happiness'

  const store = useHappinessStore()

  const workplaceShow = computed(() => {
    return store.getWorkplaceShow
  })
</script>

<template>
  <div class="header">
    <h1 class="title">Employee Happiness Comparison</h1>
    <label>
      <input type="checkbox" :value="workplaceShow" @input="store.toggleWorkplace" />
      <span class="checkmark-label"> Compare to Workplace </span>
    </label>
  </div>
</template>

<style scoped>
  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    margin: 1.875rem 0; /* 30px */
  }
  .title {
    font-family: Roboto;
    font-size: 28px;
    font-weight: 700;
    line-height: 33px;
    text-align: center;
    letter-spacing: 0em;
    color: #002236;
    width: 100%;
  }
  label {
    position: absolute;
    right: 0;
  }

  input[type='checkbox'] {
    -webkit-appearance: none;
    appearance: none;
    background-color: #fff;
    margin: 0;
    margin-right: 0.25rem;

    font: inherit;
    color: currentColor;
    width: 1em;
    height: 1em;
    border: 0.125rem solid #162438;
    border-radius: 0.25rem;
    transform: translateY(-0.125rem);

    display: inline-grid;
    place-content: center;
  }

  input[type='checkbox']:checked {
    background-color: #008fcf;
    transition: 120ms color ease-in-out;
  }

  input[type='checkbox']::before {
    content: '';
    width: 0.6rem;
    height: 0.6rem;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em #fff;

    transform-origin: center;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  }

  input[type='checkbox']:checked::before {
    transform: scale(1);
  }
</style>
