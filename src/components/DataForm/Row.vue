<script setup lang="ts">
  import { HappinessData } from '../../stores/happiness'

  defineProps<Pick<HappinessData, 'name' | 'very_happy' | 'happy' | 'content' | 'unhappy' | 'very_unhappy'>>()
  const emit = defineEmits([
    'update:very_happy',
    'update:happy',
    'update:content',
    'update:unhappy',
    'update:very_unhappy',
  ])

  function updateVeryHappy(e: Event) {
    emit('update:very_happy', (e.target as HTMLInputElement).value)
  }
  function updateHappy(e: Event) {
    emit('update:happy', (e.target as HTMLInputElement).value)
  }
  function updateContent(e: Event) {
    emit('update:content', (e.target as HTMLInputElement).value)
  }
  function updateUnhappy(e: Event) {
    emit('update:unhappy', (e.target as HTMLInputElement).value)
  }
  function updateVeryUnhappy(e: Event) {
    emit('update:very_unhappy', (e.target as HTMLInputElement).value)
  }
</script>

<template>
  <span class="happiness-grid-cell name">
    <p>{{ name }}</p>
  </span>
  <span class="happiness-grid-cell">
    <input name="very_happy" type="number" :value="very_happy" @input="updateVeryHappy" />
    <label for="very_happy">Very Happy</label>
  </span>
  <span class="happiness-grid-cell">
    <input name="happy" type="number" :value="happy" @input="updateHappy" />
    <label for="happy">Happy</label></span
  >
  <span class="happiness-grid-cell">
    <input name="content" type="number" :value="content" @input="updateContent" />
    <label for="content">Content</label>
  </span>
  <span class="happiness-grid-cell">
    <input name="unhappy" type="number" :value="unhappy" @input="updateUnhappy" />
    <label for="unhappy">Unhappy</label>
  </span>
  <span class="happiness-grid-cell">
    <input name="very_unhappy" type="number" :value="very_unhappy" @input="updateVeryUnhappy" />
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
