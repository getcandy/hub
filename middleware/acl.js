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
    const result = $auth.user.can(permissions)
    if (!result) {
        throw Error('Unauthorised')
    //   await $auth.logout()
    }
  }
}
