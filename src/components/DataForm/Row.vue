<script setup lang="ts">
  import { ref } from 'vue'
  import { HappinessData } from '../../stores/happiness'

  const props = defineProps<HappinessData>()
  // defineProps<HappinessData>({
  //     name: String,
  //     very_happy: number,
  //     happy: number,
  //     content: number,
  //     unhappy: number,
  //     very_unhappy: number,
  // })
  defineEmits(['update:very_happy', 'update:happy', 'update:content', 'update:unhappy', 'update:very_unhappy'])
</script>

<template>
  <span class="happiness-grid-cell name"
    ><p style="width: 100%">{{ name }}</p></span
  >
  <span class="happiness-grid-cell">
    <input
      name="very_happy"
      type="number"
      :value="very_happy"
      @input="$emit('update:very_happy', $event.target.value)"
    />
    <label for="very_happy">Very Happy</label>
  </span>
  <span class="happiness-grid-cell">
    <input name="happy" type="number" :value="happy" @input="$emit('update:happy', $event.target.value)" />
    <label for="happy">Happy</label></span
  >
  <span class="happiness-grid-cell">
    <input name="content" type="number" :value="content" @input="$emit('update:content', $event.target.value)" />
    <label for="content">Content</label>
  </span>
  <span class="happiness-grid-cell">
    <input name="unhappy" type="number" :value="unhappy" @input="$emit('update:unhappy', $event.target.value)" />
    <label for="unhappy">Unhappy</label>
  </span>
  <span class="happiness-grid-cell">
    <input
      name="very_unhappy"
      type="number"
      :value="very_unhappy"
      @input="$emit('update:very_unhappy', $event.target.value)"
    />
    <label for="very_unhappy">Very Unhappy</label>
  </span>
</template>

<style>
  @media only screen and (max-width: 768px) {
    .happiness-grid-cell.name {
      grid-column: 1 / span 1;
      grid-row: span 3 / span 3;
    }
  }

  .happiness-grid-cell {
    position: relative;
    grid-column: span 1 / span 1;
  }
  .happiness-grid-cell.name {
    padding-left: 2em; /* 1.44rem, ~23px */
    padding-right: 2rem; /* 32px */
    justify-self: start;
  }
  .happiness-grid-cell input {
    width: 138px;
    height: 56px;
    border-radius: 8px;
    border: 1px solid #babec4;
    background: #fff;
    box-sizing: border-box;
    padding: 27px 10px 10px;
  }
  .happiness-grid-cell label {
    position: absolute;
    top: 10px;
    left: 10px;
    color: #8b929c;
    font-size: 12px;
    line-height: 14px;
  }

  /* Hide number input spinners */
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
  }
</style>
