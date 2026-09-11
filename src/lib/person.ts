import { cookies } from "next/headers"
import { getStore } from "./store"
import type { User } from "./types"

const DEFAULT_USER_ID = "u_jana"

/**
 * Returns the current user based on the pb_person cookie.
 * Falls back to u_jana when the cookie is absent or invalid.
 * Server-side only — uses next/headers cookies().
 */
export async function currentUser(): Promise<User> {
  const cookieStore = await cookies()
  const personId = cookieStore.get("pb_person")?.value ?? DEFAULT_USER_ID

  const store = await getStore().read()
  return (
    store.users.find((u) => u.id === personId) ??
    store.users.find((u) => u.id === DEFAULT_USER_ID)!
  )
}
