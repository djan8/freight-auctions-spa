import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/auctions/$auctionUuid')({
  component: AuctionDetailPage,
})

function AuctionDetailPage() {
  const { auctionUuid } = Route.useParams()
  return (
    <>
      <Link to="/auctions">Back to List</Link>
      <div>Аукцион: {auctionUuid}</div>
    </>
  )
}
