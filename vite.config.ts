import { fileURLToPath } from 'url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), 'VITE')
  return {
    plugins: [vue()],
    define: {
      VITE_BASE_API_ENDPOINT: env['VITE_BASE_API_ENDPOINT']
    },
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