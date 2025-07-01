import { issuer } from '@openauthjs/openauth'
import { CodeProvider } from '@openauthjs/openauth/provider/code'
import { CodeUI } from '@openauthjs/openauth/ui/code'
import { handle } from 'hono/aws-lambda'
import { subjects } from './subjects.js'

async function getUser(email: string) {
  // Get user from database and return user ID
  console.log('getUser', email)
  return '123'
}

const app = issuer({
  subjects,
  // Remove after setting custom domain
  allow: async () => true,
  providers: {
    code: CodeProvider(
      CodeUI({
        sendCode: async (email, code) => {
          console.log(email, code)
        },
      }),
    ),
  },
  success: async (ctx, value) => {
    if (value.provider === 'code') {
      return ctx.subject('user', {
        id: await getUser(value.claims.email),
      })
    }
    throw new Error('Invalid provider')
  },
})

export const handler = handle(app)
