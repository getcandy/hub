/**
 * Sets the locale from the API if it's not already loaded
 * @param {Store} param0
 */

var find = require('lodash/find')

export default async function ({ app, store }) {
  const state = store.state

  app.$gc.setHttp(app.$axios)

  if (store.$auth.user) {
    // If anything isn't loaded, load it all up.
    if (
      !state.core.locale ||
      !state.core.channel ||
      !state.core.currency
    ) {
      const response = await app.$gc.root.get()
      const data = response.data

      store.commit('setApiVersion', data.version)
      store.commit('setChannel', data.channel.handle)

      app.i18n.locale = data.locale
    }

    if (!state.core.languages.length) {
      const languages = await app.$gc.languages.get()
      store.commit('setLocale', find(languages.data.data, l => l.default).code)
      store.commit('setLanguages', languages.data.data)
    }

    if (!state.core.taxes.length) {
      const taxes = await app.$gc.taxes.get()
      store.commit('setTaxes', taxes.data.data)
    }

    if (!state.core.channels.length) {
      const channels = await app.$gc.channels.get()
      store.commit('setChannels', channels.data.data)
    }

    if (!state.core.customerGroups.length) {
      //   const customerGroups = await app.$gc.customerGroups.get()
      const customerGroups = await app.$getcandy.on('customer-groups', 'getCustomerGroups')
      store.commit('setCustomerGroups', customerGroups.data.data)
    }

    if (!state.core.currencies.length) {
      const currencies = await app.$gc.currencies.get()
      store.commit('setCurrencies', currencies.data.data)
    }

    if (!state.core.currency) {
      store.commit('setCurrency', state.core.currencies.find(currency => currency.default))
    }
  }
}
