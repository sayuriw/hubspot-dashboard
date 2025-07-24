// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  components: {
    dirs: [
      {
        path: '~/app/components',
        priority: 2,
      },
    ],
    global: true,
  },
  tailwindcss: {
    configPath: 'tailwind.config.ts',
  },
  css: [
    './app/assets/css/main.css'
  ],
  typescript: {
    strict: true,
  },
  srcDir: 'app',
  imports: {
    dirs: ['composables']
  },
  app: {
    head: {
      title: 'OMR - Alles zu Digital Marketing',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
    }
  }
})