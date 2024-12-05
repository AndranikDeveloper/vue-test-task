<script lang="ts" setup>
import styles from './style.module.css'
import { ref } from 'vue'
import { useBodyOverflow } from '@/hooks/useBodyOverflow'

const props = defineProps({
  title: { type: String, required: false },
  isOpen: { type: Boolean, required: true },
  toggle: { type: Function, required: true },
})

const modalContainer = ref(null)

useBodyOverflow(props.isOpen)
</script>

<template>
  <div v-if="isOpen" :class="styles.modal">
    <div :class="styles.container" ref="modalContainer">
      <div :class="styles.close" @click="toggle()">X</div>
      <div :class="styles.title">{{ title }}</div>
      <div :class="styles.content"><slot /></div>
    </div>
  </div>
</template>
