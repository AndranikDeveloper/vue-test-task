<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useNotesStore } from '@/store/notes'
import NoteTable from '@/components/NoteTable/NoteTable.vue'

const store = useNotesStore()
const filterCompleted = ref(false)

onMounted(() => {
  store.fetchNotes()
})
</script>

<template>
  <div>
    <NoteTable />
  </div>
</template>
