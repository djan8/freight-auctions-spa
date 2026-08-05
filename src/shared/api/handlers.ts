import { http, HttpResponse, delay } from 'msw'
import type {
  AuctionListRequest,
  AuctionListResponse,
} from '@/shared/api/types.ts'
import { auctions } from '@/shared/api/mocks/db.ts'

export const handlers = [
  http.post<never, AuctionListRequest, AuctionListResponse>(
    '/api/v1/auctions/list',
    async ({ request }) => {
      const body = await request.json()
      const page = body.page ?? 1
      const perPage = body.per_page ?? 2

      let filtered = auctions

      const cargoNum = body.cargo_num

      if (cargoNum) {
        filtered = filtered.filter((a) => a.main?.cargo_num?.includes(cargoNum))
      }

      const total = filtered.length
      const start = (page - 1) * perPage
      const items = filtered.slice(start, start + perPage)
      console.log('клиент прислал', body)
      await delay(400)
      return HttpResponse.json({
        data: items,
        meta: {
          current_page: page,
          per_page: perPage,
          total,
          last_page: Math.max(1, Math.ceil(total / perPage)),
          from: items.length === 0 ? 0 : start + 1,
          to: start + items.length,
        },
      })
    },
  ),
]
