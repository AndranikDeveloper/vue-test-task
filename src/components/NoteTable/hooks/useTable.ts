import { useNotesStore } from '@/store/notes'
import type { Note } from '@/types/notes'
import { computed, nextTick, onMounted, ref, toRaw, watch, type ComputedRef, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type UseTableReturnType = {
  toggleFilterCompleted(): void
  handleChangeCompletedStatus(id: number): void
  onDeleteNote(id: number): void
  isEditMode: Ref<boolean>
  isDeleteMode: Ref<boolean>
  toggleEditMode(): void
  toggleDeleteModal(): void
  openModal(note: Note, type: 'edit' | 'delete'): void
  onSubmitHandler(e: Event): void
  currentNote: Ref<Note | null>
  ids: Ref<number[]>
  filteredNotes: ComputedRef<Note[]>
}

export const useTable = (): UseTableReturnType => {
  const store = useNotesStore()
  const route = useRoute()
  const router = useRouter()
  const ids = ref<number[]>([])

  const isEditMode = ref<boolean>(false)
  const isDeleteMode = ref<boolean>(false)
  const currentNote = ref<Note | null>(null)
  const isCompleted = ref<boolean>(false)

  onMounted(() => {
    store.fetchNotes()
  })

  const toggleFilterCompleted = () => {
    const queryFilterParams = new URLSearchParams(window.location.search)
    const isCompleted = queryFilterParams.get('completed') === 'true'
    const newCompleted = !isCompleted
    const newIds = JSON.parse((route.query.ids as string) || '[]')
    store.setFilterCompleted(newCompleted)
    updateQueryParams(newIds, newCompleted)
  }

  const handleChangeCompletedStatus = (id: number) => {
    const ids = JSON.parse((route.query.ids as string) ?? '[]')
    const check = store.toggleComplete(id, ids)

    updateQueryParams(check, store.filterCompleted)
  }

  const updateQueryParams = (ids: number[], completed: boolean) => {
    const query: Record<string, string> = {
      ids: JSON.stringify(ids),
    }

    if (completed) {
      query.completed = 'true'
    }

    router.replace({ query })
  }

  watch(
    () => route.query.ids,
    (newOne) => {
      ids.value = [...JSON.parse((newOne as string) ?? '[]')]
    },
    { immediate: true },
  )

  watch(
    () => route.query.completed,
    (newCompleted) => {
      store.setFilterCompleted(newCompleted === 'true')
    },
    { immediate: true },
  )

  watch(
    () => route.query.completed,
    (newCompleted) => {
      isCompleted.value = newCompleted === 'true'
    },
    { immediate: true },
  )

  const filteredNotes = computed(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const paramValue = queryParams.get('ids') || '[]'
    const parsedParamValue = JSON.parse(paramValue)

    const map = new Map()

    const filtered = store.notes.filter(
      (note) =>
        (note.completed && !parsedParamValue.includes(note.id)) ||
        (!note.completed && parsedParamValue.includes(note.id)),
    )

    return isCompleted.value ? filtered : store.notes
  })

  const toggleEditMode = () => {
    isEditMode.value = !isEditMode.value
  }

  const toggleDeleteModal = () => {
    isDeleteMode.value = !isDeleteMode.value
  }

  const onDeleteNote = (id: number) => {
    store.deleteNote(id)
    toggleDeleteModal()
  }

  const openModal = (note: Note, type: 'edit' | 'delete') => {
    if (type === 'edit') {
      toggleEditMode()
    } else {
      toggleDeleteModal()
    }
    currentNote.value = note
  }

  const onSubmitHandler = (e: Event) => {
    e.preventDefault()
    const formData = e.target as HTMLFormElement
    const input = formData.elements[0] as HTMLInputElement

    const newData = {
      ...currentNote.value,
      title: input.value,
    }

    store.updateNote(newData as Note)

    isEditMode.value = false
  }

  return {
    toggleFilterCompleted,
    handleChangeCompletedStatus,
    onDeleteNote,
    isEditMode,
    isDeleteMode,
    toggleEditMode,
    toggleDeleteModal,
    openModal,
    onSubmitHandler,
    currentNote,
    ids,
    filteredNotes,
  }
}
