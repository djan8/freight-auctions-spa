import { api } from '@/shared/api/client.ts'
import type {
  AuctionListRequest,
  AuctionListResponse,
  AuctionShowResponse,
  BetItem,
  BetListResponse,
  SetBetRequest,
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

export async function fetchAuctionBets(
  auctionUuid: string,
  signal?: AbortSignal,
): Promise<BetListResponse> {
  const res = await api.get<BetListResponse>(`auctions/${auctionUuid}/bets`, {
    signal,
  })
  return res.data
}

export async function postAuctionBet({
  auctionUuid,
  price,
}: { auctionUuid: string } & SetBetRequest): Promise<BetItem> {
  const res = await api.post<BetItem>(`auctions/${auctionUuid}/bets`, {
    price,
  })
  return res.data
}
