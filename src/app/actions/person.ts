"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function switchPerson(personId: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set("pb_person", personId, {
    path: "/",
    maxAge: 31536000,
    httpOnly: true,
    sameSite: "lax",
  })
  revalidatePath("/", "layout")
}
