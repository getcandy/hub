import GetCandyConfig from './getcandy.config'
require('dotenv').config()

export default {
  ssr: false,

  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: (titleChunk) => {
      // If undefined or blank then we don't need the hyphen
      return titleChunk ? `GetCandy // ${titleChunk} ` : 'GetCandy';
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'shortcut icon', type: 'image/png', href: '/favicon.png' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/css/app.scss',
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],

  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    //  '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv',
    '@nuxtjs/tailwindcss',
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@getcandy/nuxt-client',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    ['@getcandy/hub-products', {
      'preview_url': process.env.PRODUCT_PREVIEW_URL,
      'live_url': process.env.PRODUCT_LIVE_URL,
      'allow_variant_options': true
    }],
    ['@getcandy/hub-categories', {
      'preview_url': process.env.CATEGORY_PREVIEW_URL
    }],
    ['@getcandy/hub-collections', {
      'preview_url': process.env.COLLECTION_PREVIEW_URL
    }],
    '@getcandy/hub-orders',
    '@getcandy/hub-customers',
    '@getcandy/hub-shipping',
    '@getcandy/hub-reports',
    ['@getcandy/hub-core', {
      auth: 'sanctum'
    }]
  ],

  router: {
    middleware: ['auth', 'hub']
  },

  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: process.env.API_BASE,
    credentials: true,
    headers: {
      common: {
        'X-CANDY-HUB': true
      }
    }
  },

  /**
   * Auth module configuration
   * See https://auth.nuxtjs.org
   */
  auth: {
    plugins: [ '~/plugins/acl.js' ],
    strategies: {
      hub: {
        provider: 'laravel/sanctum',
        url: process.env.SANCTUM_URL,
        endpoints: {
          user: { url: '/v1/users/current?include=customer.customerGroups,roles.permissions', method: 'get', propertyName: 'data' }
        }
      }
    }
  },
  purgeCSS: {
    enabled: false
  },
  generate: {
    fallback: true
  },
  tailwindcss: {
    exposeConfig: true,
  },
  /*
  ** Build configuration
  */
  build: {
    transpile: [
      '@neondigital/vue-draggable-nested-tree',
      '@getcandy/node-client',
    ],
    postcss: {
      preset: {
        features: {
          // Fixes: https://github.com/tailwindcss/tailwindcss/issues/1190#issuecomment-546621554
          "focus-within-pseudo-class": false
        }
      }
    },
    extend(config, { isDev, isClient }) {
      config.resolve.alias["vue"] = "vue/dist/vue.common";
    }
  }
}
