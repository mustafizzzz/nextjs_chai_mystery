'use client'
import { useSession, signIn, signOut } from "next-auth/react"
export default function Component() {
  const { data: session } = useSession()

  if (session) {
    return (
      <>
        <p>Signed in as {session.user.name}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }

  return <a href="/api/auth/signin">Sign in</a>
}