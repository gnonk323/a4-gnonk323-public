"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import Button from "@/components/Button";

export default function Login({ provider, ...props }: { provider?: string }) {
  const { data: session } = useSession();

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col bg-white rounded p-4 w-full max-w-md shadow-md">
        {session ? (
          <>
            <p>Signed in as {session.user?.name}</p>
            <Button onClick={() => signOut()}>Sign out</Button>
          </>
        ) : (
          <Button onClick={() => signIn("github")}>Sign in with GitHub</Button>
        )}
      </div>
    </div>
  );
}
