<script lang="ts" setup>
import { paths } from '@/router'
import { RouterView, useRoute, useRouter } from 'vue-router'
import Footer from '@/components/Footer/Footer.vue'
import Header from '@/components/Header/Header.vue'

import styles from './style.module.css'
import { ref, watchEffect } from 'vue'

const route = useRoute()
const router = useRouter()

const filter = ref(route.query.filter || 'default')

watchEffect(() => {
  if (route.query.filter !== filter.value) {
    filter.value = route.query.filter || 'default'
  }
})

const updateFilterUrl = () => {
  router.push({ query: { filter: filter.value } })
}
</script>

<template>
  <div :class="styles.defaultLayout">
    <Header />

    <main>
      <RouterView :filter="filter" @updateFilter="updateFilterUrl" />
    </main>

    <Footer />
  </div>
</template>
