import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchAuctionBets, fetchAuctionDetail } from '@/shared/api/auctions.ts'

export const Route = createFileRoute('/auctions/$auctionUuid')({
  component: AuctionDetailPage,
})

function AuctionDetailPage() {
  const { auctionUuid } = Route.useParams()
  const {
    data: detailData,
    isPending: detailsPending,
    isError: detailError,
  } = useQuery({
    queryKey: ['auction', 'detail', auctionUuid],
    queryFn: ({ signal }) => fetchAuctionDetail(auctionUuid, signal),
  })
  const {
    data: betsData,
    isPending: betsPending,
    isError: betsError,
  } = useQuery({
    queryKey: ['auctions', 'bets', auctionUuid],
    queryFn: ({ signal }) => fetchAuctionBets(auctionUuid, signal),
  })
  if (detailsPending) return <div>Загрузка…</div>
  if (detailError) return <div>Аукцион не найден</div>
  console.log('response-', detailData)
  return (
    <>
      <>
        <Link to="/auctions">Back to List</Link>
        <div>{detailData.main?.cargo_num}</div>
        <div>
          {detailData.routes?.[0]?.location?.city_name} →{' '}
          {detailData.routes?.[1]?.location?.city_name}
        </div>
        <>
          <div>Организатор: {detailData.organizer?.organization_name}</div>
          <div>Название:{detailData?.routes?.[0]?.cargo?.name}</div>
          <div> Вес: {detailData?.routes?.[0]?.cargo?.weight}</div>
          <div>Объем: {detailData?.routes?.[0]?.cargo?.volume}</div>
        </>
        <>
          <div>Текущая цена:{detailData?.trading?.price?.current}</div>
          <div> Шаг: {detailData.trading?.price?.step} ₽</div>
          <div>
            Можешь ли ты делать ставку?:{' '}
            {detailData.trading?.can_set_bet ? 'Да' : 'Нет'}
          </div>
        </>
      </>
      <>
        {detailData.trading?.can_set_bet && (
          <Link to="/auctions/$auctionUuid/bet" params={{ auctionUuid }}>
            Сделать ставку
          </Link>
        )}

        <h3>Ставки</h3>
        {betsPending && <div>Загрузка ставок…</div>}
        {betsError && <div>Не удалось загрузить ставки</div>}
        {betsData && betsData.bets?.length === 0 && <div>Ставок пока нет</div>}
        {betsData?.bets?.map((bet) => (
          <div key={bet.id}>
            {bet.contact_name} — {bet.price_with_vat} ₽{bet.is_win && ' 🏆'}
          </div>
        ))}
      </>
    </>
  )
}
