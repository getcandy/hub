import HubUser from '@getcandy/hub-core/src/modules/HubUser.js'

export default async function ({ $auth }) {
  if ($auth.user) {
    const hubUser = new HubUser($auth.user.data)

    if (!hubUser.hasRole('admin') && !hubUser.can('access_hub')) {
      await this.logout()
      return
    }

    $auth.setUser(hubUser)
  }
}