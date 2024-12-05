import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

export const useBodyOverflow = (shouldHideOverflow: boolean) => {
  onMounted(() => {
    if (shouldHideOverflow) {
      document.body.style.overflow = 'hidden'
    }
  })

  watch(
    () => shouldHideOverflow,
    (newValue) => {
      if (newValue) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    },
  )

  onBeforeUnmount(() => {
    document.body.style.overflow = ''
  })
}
