<script lang="ts" setup>
import { paths } from '@/router'
import './style.css'
</script>

<template>
  <header>
    <nav>
      <router-link :to="paths.home">Notes List</router-link>
      <router-link :to="paths.addNote">Add New Note</router-link>
    </nav>
  </header>
</template>
