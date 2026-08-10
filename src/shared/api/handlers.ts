import { http, HttpResponse, delay } from 'msw'
import type {
  AuctionListRequest,
  AuctionListResponse,
  AuctionShowResponse,
  BetItem,
  BetListResponse,
  SetBetRequest,
  ValidationProblem,
} from '@/shared/api/types.ts'
import { auctions } from '@/shared/api/mocks/db.ts'
import { findAuctionDetail } from '@/shared/api/mocks/details.ts'
import { betsStore } from '@/shared/api/mocks/bets.ts'

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
  http.get<{ auctionUuid: string }, never, AuctionShowResponse>(
    '/api/v1/auctions/:auctionUuid',
    async ({ params }) => {
      await delay(300)
      const detail = findAuctionDetail(params.auctionUuid)

      if (!detail) {
        return HttpResponse.json(null, { status: 404 })
      }
      return HttpResponse.json(detail)
    },
  ),
  http.get<{ auctionUuid: string }, never, BetListResponse>(
    '/api/v1/auctions/:auctionUuid/bets',
    async ({ params, request }) => {
      await delay(300)
      const url = new URL(request.url)
      const showAll = url.searchParams.get('all') === 'true'
      const bets = betsStore[params.auctionUuid] ?? []
      const visible = showAll ? bets : bets.filter((b) => !b.is_rejected)

      return HttpResponse.json({ bets: visible })
    },
  ),
  http.post<
    { auctionUuid: string },
    SetBetRequest,
    BetItem | ValidationProblem
  >('/api/v1/auctions/:auctionUuid/bets', async ({ params, request }) => {
    const body = await request.json()
    await delay(300)

    if (!body.price || body.price <= 0) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          title: 'Ошибка валидации',
          message: 'Запрос содержит некорректные поля.',
          errors: [{ field: 'price', message: 'Цена должна быть больше 0.' }],
        },
        { status: 422 },
      )
    }

    const auction = auctions.find(
      (a) => a.main?.order_uid === params.auctionUuid,
    )
    if (!auction) {
      return HttpResponse.json(null, { status: 404 })
    }

    const newBet: BetItem = {
      id: Date.now(),
      created_at: new Date().toISOString(),
      auction_id: auction.main?.id,
      contact_name: 'Вы',
      price_with_vat: body.price,
      price_no_vat: Math.round((body.price / 1.2) * 100) / 100,
      is_rejected: false,
      is_counter: false,
      place: 1,
      is_win: false,
      run_number: 0,
      cancel_reason: '',
    }

    const bets = betsStore[params.auctionUuid] ?? []
    betsStore[params.auctionUuid] = [newBet, ...bets]

    if (auction.trading) {
      auction.trading.your = { bet: true, last_bet: body.price }
      auction.trading.status_mobile = 'Leading'
      if (auction.trading.price) {
        auction.trading.price.current = body.price
      }
    }

    return HttpResponse.json(newBet)
  }),
]
