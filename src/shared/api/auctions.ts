
import { api } from '@/shared/api/client.ts'
import type {
  AuctionListRequest,
  AuctionListResponse,
} from '@/shared/api/types.ts'

export async function fetchAuctionList(
  body: AuctionListRequest,
  signal?: AbortSignal
): Promise<AuctionListResponse> {
  const res = await api.post<AuctionListResponse>('auctions/list', body, { signal })
  return res.data
}