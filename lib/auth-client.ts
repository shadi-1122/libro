import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.NEXT_APP_URL,
})

export const { signIn, signUp, useSession, signOut, requestPasswordReset , resetPassword } = createAuthClient()