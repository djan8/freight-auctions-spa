import { setupServer } from 'msw/node'
import { handlers } from '@/shared/api/handlers.ts'

export const server = setupServer(...handlers)
