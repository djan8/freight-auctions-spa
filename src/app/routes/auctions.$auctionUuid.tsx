import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchAuctionDetail } from '@/shared/api/mocks/auctions.ts'

export const Route = createFileRoute('/auctions/$auctionUuid')({
  component: AuctionDetailPage,
})

function AuctionDetailPage() {
  const { auctionUuid } = Route.useParams()
  const { data, isPending, isError } = useQuery({
    queryKey: ['auction', 'detail', auctionUuid],
    queryFn: ({ signal }) => fetchAuctionDetail(auctionUuid, signal),
  })
  if (isPending) return <div>Загрузка…</div>
  if (isError) return <div>Аукцион не найден</div>
  console.log('response-', data)
  return (
    <>
      <Link to="/auctions">Back to List</Link>
      <div>{data.main?.cargo_num}</div>
      <div>
        {data.routes?.[0]?.location?.city_name} →{' '}
        {data.routes?.[1]?.location?.city_name}
      </div>
      <div>Организатор: {data.organizer?.organization_name}</div>
    </>
  )
}
