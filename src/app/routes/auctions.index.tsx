import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import { fetchAuctionList } from '@/shared/api/auctions.ts'
import {
  auctionSearchParamsSchema,
  buildApiRequestFromParams,
} from '@/features/auction-filters/search-params-schema'

export const Route = createFileRoute('/auctions/')({
  component: AuctionsPage,
  validateSearch: (search) => auctionSearchParamsSchema.parse(search),
})

function AuctionsPage() {
  const search = Route.useSearch()
  const apiBoby = buildApiRequestFromParams(search)
  const navigate = useNavigate({ from: Route.fullPath })
  const setPage = (newPage: number) => {
    navigate({ search: (prev) => ({ ...prev, page: newPage }) })
  }

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['auctions', 'list', apiBoby],
    queryFn: ({ signal }) => fetchAuctionList(apiBoby, signal),
    staleTime: 30_000,
  })

  if (isPending) return <div>Загрузка…</div>
  if (isError) return <div>Ошибка: {String(error)}</div>

  const lastPage = data.meta?.last_page ?? 1
  const arrayPage = Array.from({ length: lastPage }, (_, i) => i + 1)
  return (
    <>
      <input
        type="number"
        value={search.page}
        onChange={(e) => setPage(Number(e.target.value))}
      />
      <select value={search.page} onChange={(e) => setPage(+e.target.value)}>
        {arrayPage.map((page, index) => (
          <option key={index} value={page}>
            {page}
          </option>
        ))}
      </select>
      <div>
        {data.data?.map((el) => (
          <Link
            to="/auctions/$auctionUuid"
            key={el.main?.id}
            params={{ auctionUuid: el.main?.order_uid ?? '' }}
          >
            <div key={el.main?.id}>
              {el.main?.cargo_num}-{el.route?.load?.city} {'->'}
              {el.route?.unload?.city}- {el.trading?.price?.current} ₽
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
