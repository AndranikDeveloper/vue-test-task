<script lang="ts" setup>
import { useNotesStore } from '../../store/notes.ts'

import styles from './style.module.css'
import Button from '@/ui/Button/Button.vue'
import { useTable } from './hooks/useTable.ts'
import Modal from '@/ui/Modal/Modal.vue'
import Input from '@/ui/Input/Input.vue'
import { computed, ref, toRaw, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Note } from '@/types/notes.ts'

const store = useNotesStore()
const {
  toggleFilterCompleted,
  handleChangeCompletedStatus,
  onDeleteNote,
  isEditMode,
  toggleEditMode,
  toggleDeleteModal,
  openModal,
  onSubmitHandler,
  currentNote,
  isDeleteMode,
  filteredNotes,
} = useTable()
const route = useRoute()
</script>

<template>
  <Modal :isOpen="isEditMode" title="Edit Title" :toggle="toggleEditMode">
    <form :class="styles.formBlock" @submit.prevent="onSubmitHandler">
      <Input placeholder="Name" name="title" :value="currentNote?.title" />
      <Button type="submit">Save</Button>
      <Button :onClick="toggleEditMode" type="button">Cancel</Button>
    </form>
  </Modal>
  <Modal
    :isOpen="isDeleteMode"
    title="Are you sure you want to Delete this Note"
    :toggle="toggleDeleteModal"
  >
    <div :class="styles.formBlock">
      <Button :onClick="() => currentNote && onDeleteNote(currentNote.id)" variant="danger"
        >Delete</Button
      >
      <Button :onClick="toggleDeleteModal" type="button">Cancel</Button>
    </div>
  </Modal>
  <div :class="styles.todoContainer">
    <table :class="styles.todoTable">
      <thead>
        <tr>
          <th>Task</th>
          <th @click="toggleFilterCompleted" :class="styles.filterHeader">Completed Status</th>
          <th>Note Link</th>
          <th>Edit</th>
          <th>Trash</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="note in filteredNotes" :key="note.id">
          <td>
            <span :class="[{ finished: note.completed }]">{{ note.title }}</span>
          </td>
          <td
            :class="[
              styles.status,
              {
                [styles.completed]:
                  (JSON.parse((route.query.ids as string) ?? '[]').includes(note.id) &&
                    !note.completed) ||
                  (!JSON.parse((route.query.ids as string) ?? '[]').includes(note.id) &&
                    note.completed),
                [styles.notCompleted]:
                  (JSON.parse((route.query.ids as string) ?? '[]').includes(note.id) &&
                    note.completed) ||
                  (!JSON.parse((route.query.ids as string) ?? '[]').includes(note.id) &&
                    !note.completed),
              },
            ]"
            @click="handleChangeCompletedStatus(note.id)"
          >
            <input
              type="checkbox"
              :checked="
                (JSON.parse((route.query.ids as string) ?? '[]').includes(note.id) &&
                  !note.completed) ||
                (!JSON.parse((route.query.ids as string) ?? '[]').includes(note.id) &&
                  note.completed)
              "
              :class="styles.checkbox"
            />
            {{
              JSON.parse((route.query.ids as string) ?? '[]').includes(note.id)
                ? note.completed
                  ? 'Not completed'
                  : 'Completed'
                : note.completed
                  ? 'Completed'
                  : 'Not completed'
            }}
          </td>
          <td>
            <router-link :to="{ name: 'NoteDetail', params: { slug: note.slug } }">
              View Detail
            </router-link>
          </td>
          <td>
            <Button :onClick="() => openModal(note, 'edit')">Edit</Button>
          </td>
          <td>
            <Button :onClick="() => openModal(note, 'delete')" variant="danger">Delete</Button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
