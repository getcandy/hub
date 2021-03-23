
# 0.12.0

### Upgrading

**This release contains high impact changes. Please make sure you follow the upgrade guide carefully.**

In `middleware/hub.js`

Remove

```
  app.$getcandy.setHttp(app.$axios)
```

Replace line `31` with:
```
--- store.commit('setLocale', find(languages.data.data, l => l.default).lang)
+++ store.commit('setLocale', find(languages.data.data, l => l.default).code)
```

Replace line `47` with:

```
--- const customerGroups = await app.$getcandy.on('CustomerGroups').getCustomerGroups()
+++ const customerGroups = await app.$getcandy.on('customer-groups', 'getCustomerGroups')
```

Update the `@getcandy` packages version constraint to `~0.12.0` except for `@getcandy/node-client` that should stay as it is.

Update these other packages:

- `@tailwindcss/ui` to `^0.7.0`
- `@nuxtjs/tailwindcss` to `^3.4.2`

Add `"@tailwindcss/forms": "^0.1.4"` to your dependencies.

Replace your `tailwind.config.js` with the config below. Bear in mind to migrate any changes you may have done yourself.

```javascript
module.exports = {
  theme: {},
  variants: {
    extend: {
      opacity: ['disabled']
    }
  },
  plugins: [
    require('@tailwindcss/ui')
  ],
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'plugins/**/*.js',
      'nuxt.config.js',
      // TypeScript
      'plugins/**/*.ts',
      'nuxt.config.ts',
      './node_modules/@getcandy/**/src/**/*.vue'
    ]
  }
}
```

In `nuxt.config.js`

- Replace the `@getcandy/js-client-nuxt` package with `@getcandy/nuxt-client` at the same version constraint
- Remove `@getcandy/js-client-nuxt` fully from `buildModules`

At the top of `modules` include the new package..

```javascript
  modules: [
    '@getcandy/nuxt-client',
    // ...
  ]
```

Save this icon sprite under `static/icon-sprite.svg`
[https://github.com/tabler/tabler-icons/blob/master/tabler-sprite.svg](https://github.com/tabler/tabler-icons/blob/master/tabler-sprite.svg)

## Laravel Sanctum Users

Replace `@nuxtjs/auth` with the updated Nuxt Auth module.

```
-- "@nuxtjs/auth": "^4.4"
++ "@nuxtjs/auth-next": "^5.0.0-1611574754.9020f2a",
```

Add the updated auth module to your modules:

```javascript
modules: [
  '@nuxtjs/auth-next' // Add below @nuxtjs/axios
]
```

Update your `middleware/acl.js` file as follows:

```javascript
import HubUser from '@getcandy/hub-core/src/modules/HubUser.js'

export default async function ({ store, route, redirect, $auth }) {
  if (!$auth.user) {
    await $auth.logout()
  }

  if (!($auth.user instanceof HubUser)) {
    const hubUser = new HubUser($auth.user.data)
    await $auth.setUser(hubUser)
  }

  const meta = route.meta[0]
  const permissions = meta ? meta.permissions : null

  if (permissions && !$auth.user.hasRole('admin')) {
    const result = user.can(permissions)
    if (!result) {
      await $auth.logout
    }
  }
}
```

Update the auth section in your `nuxt.config.js` to:

```javascript
  auth: {
    strategies: {
      hub: {
        provider: 'laravel/sanctum',
        url: `http://localhost:8000/api`,
        endpoints: {
          user: { url: '/v1/users/current?include=customer.customerGroups', method: 'get', propertyName: 'data' }
        }
      }
    }
  }
```

### 🐞 Fixes
- Fixed an issue where the account section wouldn't load
- Fixed an issue where `formErrors` would return undefined, causing some pages to crash.
- Search has been fixed on products page
- Fixed an issue where media uploads would not trigger and then be added to a draft.
- Fixed an issue which stopped the attribute groups page from loading
- Fixed an issue that prevented a user from updating their password on their account

### ⭐ Improvements

- We're now using the updated Nuxt Auth module for authentication.
- Improvements have been made to shipping method editing (although still under review)
- Improvements to product drafting and attaching media files.
- Updated to Tailwind 2.0, progressed with removing Buefy and adding ESlint
- Changed icons to a linked SVG
- Redesigned the hub navigation
- Stability improvements to Product and Category editing.
