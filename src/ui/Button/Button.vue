<script lang="ts" setup>
import styles from './style.module.css'
import { defineProps, ref, type PropType } from 'vue'

type Props = {}

const props = defineProps({
  onClick: {
    type: Function as PropType<(payload: MouseEvent) => void>,
    required: false,
  },
  type: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button',
  },
  variant: {
    type: String as PropType<'primary' | 'danger'>,
    required: false,
    default: 'primary',
  },
})

const buttonRef = ref(null)
</script>

<template>
  <button
    :class="[styles.button, styles[`button--${props.variant}`]]"
    @click="onClick"
    :type="props.type"
    ref="buttonRef"
  >
    <slot />
  </button>
</template>
