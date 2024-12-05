<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import styles from './style.module.css'

const props = defineProps({
  shouldSearch: { type: Boolean, default: false },
  type: String,
  placeholder: String,
  value: [String, Number],
  onInput: Function as PropType<(event: Event) => void>,
  name: String,
})

const inputStyle = computed(() => {
  return !props.shouldSearch ? { padding: '12px 24px 12px 15px' } : {}
})
</script>

<template>
  <div :class="styles.inputBlock">
    <input
      :style="inputStyle"
      :class="styles.input"
      :type="props.type"
      :placeholder="props.placeholder"
      :value="props.value"
      :name="props.name"
      @input="props.onInput"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
    />
  </div>
</template>
