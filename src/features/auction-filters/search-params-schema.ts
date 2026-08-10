import type { AuctionListRequest } from '@/shared/api/types'
import { z } from 'zod'

export const auctionSearchParamsSchema = z.object({
  page: z.coerce.number().default(1).catch(1),
  per_page: z.coerce.number().default(10).catch(10),
  cargo_num: z.string().optional().catch(undefined),
  load_city: z.string().optional().catch(undefined),
  unload_city: z.string().optional().catch(undefined),
  load_date_from: z.string().optional().catch(undefined),
  load_date_to: z.string().optional().catch(undefined),
  is_available: z.coerce.boolean().optional().catch(undefined),
  is_bidder: z.coerce.boolean().optional().catch(undefined),
  current_price_from: z.coerce.number().optional().catch(undefined),
  current_price_to: z.coerce.number().optional().catch(undefined),
  auc_type: z.string().optional().catch(undefined),
  status: z.string().optional().catch(undefined),
  statuses: z.string().optional().catch(undefined),
})

export type AuctionSearchParams = z.output<typeof auctionSearchParamsSchema>

export function buildApiRequestFromParams(
  params: AuctionSearchParams,
): AuctionListRequest {
  // Напиши логику сборки объекта запроса
  const newParams: Record<string, any> = {
    // создает объект с ключами типа string и значениями типа any
    page: params.page,
    per_page: params.per_page,
  }
  for (const key in params) {
    const value = params[key as keyof AuctionSearchParams]
    if (value !== undefined) {
      newParams[key] = value
    }
  }
  return newParams
}
