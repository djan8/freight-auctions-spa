import type { AuctionShowResponse } from '@/shared/api/types.ts'
import { auctions } from '@/shared/api/mocks/db.ts'

export function findAuctionDetail(
  auctionUuid: string,
): AuctionShowResponse | undefined {
  const item = auctions.find((a) => a.main?.order_uid === auctionUuid)
  if (!item) return undefined
  return {
    main: item.main ?? {},
    organizer: item.organizer ?? {},
    cargo: item.cargo ?? {},
    trading: (item.trading ?? {}) as AuctionShowResponse['trading'],
    payment: item.payment ?? {},
    contacts: [],
    assembly: { num: '1', date: item.main?.cargo_date },
    routes: [
      {
        op_type: 'Loading',
        location: {
          city_name: item.route?.load?.city,
          city_gc_id: item.route?.load?.city_gc_id,
        },
        cargo: {
          name: item.cargo?.name,
          weight: String(item.cargo?.weight ?? ''),
          volume: String(item.cargo?.volume ?? ''),
        },
      },
      {
        op_type: 'Unloading',
        location: {
          city_name: item.route?.unload?.city,
          city_gc_id: item.route?.unload?.city_gc_id,
        },
      },
    ],
    admitted_organizations: [],
  }
}
