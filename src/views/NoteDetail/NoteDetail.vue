<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotesStore } from '@/store/notes'

const route = useRoute()
const router = useRouter()
const store = useNotesStore()

const note = computed(() => store.notes.find((n) => n.slug === route.params.slug))

const goBack = () => router.back()
</script>

<template>
  <div v-if="note">
    <h1>{{ note.title }}</h1>
    <p>{{ note.description }}</p>
    <p><strong>Status:</strong> {{ note.completed ? 'Completed' : 'Not Completed' }}</p>
    <button @click="goBack">Back</button>
  </div>
</template>
