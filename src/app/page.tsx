"use client"

import { signIn, useSession } from "next-auth/react"
import Button from "@/components/Button";
import {useRouter} from "next/navigation";
import { useEffect } from "react";

export default function Login({ provider, ...props }: { provider?: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col bg-white rounded p-4 w-full max-w-md shadow-md">
        {session ? (null) : (
          <>
            <p className="mb-3 text-center">You aren't signed in :(</p>
            <Button onClick={() => signIn("github")}>Sign in with GitHub</Button>
          </>
        )}
      </div>
    </div>
  );
}
