<script lang="ts" setup>
import Header from '@/components/Header/Header.vue'
import styles from './style.module.css'
import { RouterView } from 'vue-router'
</script>

<template>
  <div :class="styles.noFooterLayout">
    <Header />

    <main>
      <RouterView />
    </main>
  </div>
</template>
