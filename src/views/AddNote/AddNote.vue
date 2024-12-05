<script lang="ts" setup>
import styles from './style.module.css'
import { useNotesStore } from '@/store/notes'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import Input from '@/ui/Input/Input.vue'
import Button from '@/ui/Button/Button.vue'

const store = useNotesStore()
const router = useRouter()

const title = ref('')
const description = ref('')
const completed = ref(false)

const titleError = ref('')
const descriptionError = ref('')

const validateTitle = () => {
  if (!title.value) {
    titleError.value = 'Title is required'
  } else if (title.value.length < 3) {
    titleError.value = 'Minimum 3 characters'
  } else {
    titleError.value = ''
  }
}

const validateDescription = () => {
  if (description.value && description.value.length > 150) {
    descriptionError.value = 'Description cannot exceed 150 characters'
  } else {
    descriptionError.value = ''
  }
}

const submitForm = (e: Event) => {
  e.preventDefault()

  const formData = e.target as HTMLFormElement

  const input = formData.elements.namedItem('title') as HTMLInputElement
  const textarea = formData.elements.namedItem('description') as HTMLTextAreaElement
  const checkbox = formData.elements.namedItem('checkbox') as HTMLInputElement

  title.value = input.value
  description.value = textarea.value
  completed.value = checkbox.checked

  validateTitle()
  validateDescription()

  if (!titleError.value && !descriptionError.value) {
    const newNote = {
      id: store.notes.length + 1,
      title: title.value,
      description: description.value,
      completed: checkbox.checked,
      slug: title.value.replace(/\s+/g, '-').toLowerCase(),
    }

    const addedNotes = localStorage.getItem('addedNotes') ?? '[]'
    const parsedNotes = JSON.parse(addedNotes)
    localStorage.setItem('addedNotes', JSON.stringify([newNote, ...parsedNotes]))
    router.push('/')
  }
}

const clearErrors = (field: 'title' | 'description') => {
  if (field === 'title') {
    titleError.value = ''
  } else if (field === 'description') {
    descriptionError.value = ''
  }
}
</script>

<template>
  <div :class="styles.content">
    <h1>Create Note</h1>
    <form @submit.prevent="submitForm">
      <div>
        <Input
          v-model="title"
          @focus="clearErrors('title')"
          placeholder="Title"
          :class="{ [styles.isValid]: titleError }"
          name="title"
        />
        <span v-if="titleError" :class="styles.errorMessage">{{ titleError }}</span>
      </div>
      <div>
        <textarea
          name="description"
          v-model="description"
          @blur="validateDescription"
          @focus="clearErrors('description')"
          placeholder="Description"
        ></textarea>
        <span v-if="descriptionError" :class="styles.errorMessage">{{ descriptionError }}</span>
      </div>
      <div>
        <label> <input type="checkbox" name="checkbox" v-model="completed" /> Completed </label>
      </div>
      <Button type="submit" :disabled="!!(titleError || descriptionError)">Add</Button>
    </form>
  </div>
</template>
