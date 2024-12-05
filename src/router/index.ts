import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layout/DefaultLayout/DefaultLayout.vue'
import AddNote from '@/views/AddNote/AddNote.vue'
import NoteDetail from '@/views/NoteDetail/NoteDetail.vue'
import NoFooterLayout from '@/layout/NoFooterLayout/NoFooterLayout.vue'
import NotesList from '@/views/NotesList/NotesList.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    name: 'Home',
    children: [
      {
        path: '',
        component: NotesList,
        name: 'NotesList',
      },
      {
        path: 'add-note',
        component: AddNote,
        name: 'AddNote',
      },
      {
        path: 'todo/:slug',
        component: NoteDetail,
        name: 'NoteDetail',
      },
    ],
  },
  {
    path: '/no-footer',
    component: NoFooterLayout,
    name: 'NoFooterLayout',
    children: [],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

type RouteNames = typeof routes extends { children: Array<{ name: string }> }
  ? (typeof routes)[0]['children'][number]['name'] | (typeof routes)[0]['name']
  : never

export type AppLinks = RouteNames

export const paths = {
  home: '/',
  addNote: '/add-note',
  todoDetail: '/todo/:slug',
}
