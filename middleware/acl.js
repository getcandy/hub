export default function ({ store, route, redirect }) {
  const meta = route.meta[0]
  const permissions = meta ? meta.permissions : null
  const user = store.$auth.user

  if (permissions && !user.hasRole('admin')) {
    const result = user.can(permissions)
    if (!result) {
      redirect(401, '/unauthorized')
    }
  }
}
