// Third-party Imports
import CredentialProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'

// Local Imports
import { authService } from '@/services'

const prisma = new PrismaClient()

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  // ** Configure one or more authentication providers
  // ** Please refer to https://next-auth.js.org/configuration/options#providers for more `providers` options
  providers: [
    CredentialProvider({
      // ** The name to display on the sign in form (e.g. 'Sign in with...')
      // ** For more details on Credentials Provider, visit https://next-auth.js.org/providers/credentials
      id: 'otp-credentials',
      name: 'OTP Authentication',
      type: 'credentials',

      /*
       * As we are using our own Sign-in page, we do not need to change
       * username or password attributes manually in following credentials object.
       */
      credentials: {},
      async authorize(credentials) {
        /*
         * OTP-based authentication logic
         * This expects credentials to contain: token (from OTP request) and otp (verification code)
         */
        const { token, otp } = credentials

        try {
          if (!token || !otp) {
            throw new Error('Token and OTP are required')
          }

          // ** Verify OTP with backend
          const authResult = await authService.verifyOtp(token, otp)

          if (authResult && authResult.user) {
            // ** Return user object with backend token for future API calls
            return {
              id: authResult.user.id?.toString() || Math.random().toString(),
              mobile: authResult.user.mobile,
              verified_at: authResult.user.verified_at,
              panel_id: authResult.user.panel_id,
              accessToken: authResult.token,
              // Add any other user properties you need
              ...authResult.user
            }
          }

          return null
        } catch (error) {
          console.error('OTP Authorization Error:', error)
          throw new Error(error.message || 'OTP verification failed')
        }
      }
    }),
    CredentialProvider({
      // ** Legacy email/password authentication (keeping for backward compatibility)
      id: 'email-credentials',
      name: 'Email Credentials',
      type: 'credentials',

      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials

        try {
          // ** Login API Call to match the user credentials and receive user data in response along with his role
          const res = await fetch(`${process.env.API_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          })

          const data = await res.json()

          if (res.status === 401) {
            throw new Error(JSON.stringify(data))
          }

          if (res.status === 200) {
            /*
             * Please unset all the sensitive information of the user either from API response or before returning
             * user data below. Below return statement will set the user object in the token and the same is set in
             * the session which will be accessible all over the app.
             */
            return data
          }

          return null
        } catch (e) {
          throw new Error(e.message)
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })

    // ** ...add more providers here
  ],

  // ** Please refer to https://next-auth.js.org/configuration/options#session for more `session` options
  session: {
    /*
     * Choose how you want to save the user session.
     * The default is `jwt`, an encrypted JWT (JWE) stored in the session cookie.
     * If you use an `adapter` however, NextAuth default it to `database` instead.
     * You can still force a JWT session by explicitly defining `jwt`.
     * When using `database`, the session cookie will only contain a `sessionToken` value,
     * which is used to look up the session in the database.
     * If you use a custom credentials provider, user accounts will not be persisted in a database by NextAuth.js (even if one is configured).
     * The option to use JSON Web Tokens for session tokens must be enabled to use a custom credentials provider.
     */
    strategy: 'jwt',

    // ** Seconds - How long until an idle session expires and is no longer valid
    maxAge: 30 * 24 * 60 * 60 // ** 30 days
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#pages for more `pages` options
  pages: {
    signIn: '/login'
  },

  // Enable debug in development
  debug: process.env.NODE_ENV === 'development',

  // ** Please refer to https://next-auth.js.org/configuration/options#callbacks for more `callbacks` options
  callbacks: {
    /*
     * While using `jwt` as a strategy, `jwt()` callback will be called before
     * the `session()` callback. So we have to add custom parameters in `token`
     * via `jwt()` callback to make them accessible in the `session()` callback
     */
    async jwt({ token, user }) {
      if (user) {
        /*
         * For adding custom parameters to user in session, we first need to add those parameters
         * in token which then will be available in the `session()` callback
         */
        token.id = user.id
        token.mobile = user.mobile
        token.verified_at = user.verified_at
        token.panel_id = user.panel_id
        token.accessToken = user.accessToken
        token.name = user.name || user.mobile // Use mobile as name if name not available
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // ** Add custom params to user in session which are added in `jwt()` callback via `token` parameter
        session.user.id = token.id
        session.user.mobile = token.mobile
        session.user.verified_at = token.verified_at
        session.user.panel_id = token.panel_id
        session.user.accessToken = token.accessToken
        session.user.name = token.name
      }

      return session
    }
  }
}
