import { api } from '@/shared/api/client.ts'
import type {
  AuctionListRequest,
  AuctionListResponse,
  AuctionShowResponse,
} from '@/shared/api/types.ts'

export async function fetchAuctionList(
  body: AuctionListRequest,
  signal?: AbortSignal,
): Promise<AuctionListResponse> {
  const res = await api.post<AuctionListResponse>('auctions/list', body, {
    signal,
  })
  return res.data
}

export async function fetchAuctionDetail(
  auctionUuid: string,
  signal?: AbortSignal,
): Promise<AuctionShowResponse> {
  const res = await api.get<AuctionShowResponse>(`auctions/${auctionUuid}`, {
    signal,
  })
  return res.data
}
