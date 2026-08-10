import type { components } from '@/shared/api/schema.ts'

export type AuctionListItem = components['schemas']['AuctionListItem']
export type AuctionListRequest = components['schemas']['AuctionListRequest']
export type AuctionListResponse =
  components['schemas']['AuctionListResponseBase']
export type AuctionShowResponse = components['schemas']['AuctionShowResponse']

export type BetListResponse = components['schemas']['BetListResponse']
export type BetItem = components['schemas']['BetItem']
export type SetBetRequest = components['schemas']['SetBetRequest']
export type ValidationProblem = components['schemas']['ValidationProblem']
