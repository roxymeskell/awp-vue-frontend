import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  return {
    plugins: [vue()],
    resolve: {
      alias: [
        {
            find: /@\/components\/((?!.*[.](ts|js|tsx|jsx|vue)$).*$)/,
            replacement: fileURLToPath(
                new URL("./src/components/$1/index.vue", import.meta.url)
            ),
        },
        {
            find: "@",
            replacement: fileURLToPath(new URL("./src", import.meta.url)),
        },
      ]
    }
  }
})