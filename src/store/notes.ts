import type { Note } from '@/types/notes'
import { defineStore } from 'pinia'
import { toRaw } from 'vue'
import { useRoute } from 'vue-router'

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [] as Note[],
    filterCompleted: false,
  }),
  actions: {
    async fetchNotes() {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts')
      const data: Note[] = await response.json()

      const initialNotes = localStorage.getItem('addedNotes') ?? '[]'
      const parsedInitialNotes = JSON.parse(initialNotes)

      this.notes = [
        ...parsedInitialNotes,
        ...data.map((note) => ({
          id: note.id,
          title: note.title,
          description: note.body || '',
          completed: false,
          slug: note.title.replace(/\s+/g, '-').toLowerCase(),
        })),
      ]
    },
    addNote(note: Omit<Note, 'id'>) {
      this.notes = [{ ...note, id: this.notes.length + 1 }, ...this.notes]
    },

    updateNote(updatedNote: Note) {
      const { id } = updatedNote
      const index = this.notes.findIndex((note) => note.id === id)

      const addedNotes = localStorage.getItem('addedNotes') ?? '[]'
      const parsedNotes = JSON.parse(addedNotes)

      const storageIndex = parsedNotes.findIndex((note: Note) => note.id === updatedNote.id)

      if (storageIndex !== -1) {
        parsedNotes[storageIndex] = updatedNote
        localStorage.setItem('addedNotes', JSON.stringify([...parsedNotes]))
      }
      if (index !== -1) {
        this.notes[index] = updatedNote
      }
    },
    deleteNote(id: number) {
      this.notes = this.notes.filter((note) => note.id !== id)

      const addedNotes = localStorage.getItem('addedNotes') ?? '[]'
      const parsedNotes = JSON.parse(addedNotes)
      const filteredNotes = parsedNotes.filter((note: Note) => note.id !== id)
      localStorage.setItem('addedNotes', JSON.stringify([...filteredNotes]))
    },
    toggleComplete(id: number, ids: number[]) {
      let changedNotes: number[] = [...ids]
      if (!ids.includes(id)) {
        changedNotes.push(id)
      } else {
        changedNotes = changedNotes.filter((noteId) => noteId !== id)
      }

      return changedNotes
    },
    setFilterCompleted(value: boolean) {
      this.filterCompleted = value
    },
  },
  getters: {
    getNotes(state) {
      const queryParams = new URLSearchParams(window.location.search)
      const paramValue = queryParams.get('ids') || '[]'
      const parsedParamValue = JSON.parse(paramValue)

      const queryFilterParams = new URLSearchParams(window.location.search)
      const isCompleted = queryFilterParams.get('completed') || 'false'

      const map = new Map()

      parsedParamValue.forEach((el: Note) => {
        map.set(el, el)
      })

      const filtered = state.notes.filter((note) => map.has(note.id))

      return JSON.parse(isCompleted) ? filtered : state.notes
    },
  },
})
