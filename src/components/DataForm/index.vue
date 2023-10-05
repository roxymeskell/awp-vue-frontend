<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import HappinessInputRow from './Row.vue'
  import { HappinessData, useHappinessStore } from '@/stores/happiness'

  const store = useHappinessStore()
  const happiness = computed(() => {
    return store.getHappiness
  })
  onMounted(() => {
    store.fetchAllHappiness()
  })

  async function onSave() {
    for (const { id, very_happy, happy, content, unhappy, very_unhappy } of happiness.value) {
      await store.updateHappiness(id, {
        very_happy,
        happy,
        content,
        unhappy,
        very_unhappy,
      })
    }
  }
</script>

<template>
  <div class="happiness-container">
    <div class="happiness-grid-container">
      <div class="happiness-grid">
        <HappinessInputRow
          v-for="h in happiness"
          :name="h.name"
          v-model:very_happy="h.very_happy"
          v-model:happy="h.happy"
          v-model:content="h.content"
          v-model:unhappy="h.unhappy"
          v-model:very_unhappy="h.very_unhappy"
        />
      </div>
    </div>
    <div class="button-div">
      <button class="save-button" @click="onSave">Save</button>
    </div>
  </div>
</template>

<style scoped>
  @media only screen and (max-width: 768px) {
    .happiness-grid {
      grid-template-columns: repeat(3, minmax(0, max-content)) !important;
    }
  }

  .happiness-container {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .happiness-grid-container {
    padding: 1.875rem 0; /* 30px */
    margin: 1.875rem 0; /* 30px */
    border-top: 1px solid #d9d9d9;
    border-bottom: 1px solid #d9d9d9;

    display: flex;
    flex-direction: column;
    align-items: end;
    justify-content: start;
  }
  .happiness-grid {
    display: grid;
    /*grid-template-columns: repeat(6, minmax(0, 1fr));*/
    grid-template-columns: repeat(6, minmax(0, max-content));
    grid-template-rows: auto;
    place-content: center;
    place-items: start;
    justify-items: end;

    column-gap: 1.8rem; /* ~29px */
    row-gap: 0.625rem; /* 10px */
  }

  .button-div {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .button-div button.save-button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    color: #fff;
    background-color: #008fcf;
    cursor: pointer;
    transition: border-color 0.25s;

    width: 100%;
    max-width: 8.625rem; /*138px*/
  }
  .button-div button.save-button:hover {
    border-color: #008fcf;
  }
  .button-div button.save-button:focus,
  .button-div button.save-button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
</style>
