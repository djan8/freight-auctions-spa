import { fetchAuctionDetail, postAuctionBet } from '@/shared/api/auctions'
import { useToastStore } from '@/shared/model/toast-store'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

export const Route = createFileRoute('/auctions/$auctionUuid_/bet')({
  component: BetPage,
})

function BetPage() {
  const { auctionUuid } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const addToast = useToastStore((state) => state.addToast)

  const { data: detailData, isPending } = useQuery({
    queryKey: ['auction', 'detail', auctionUuid],
    queryFn: ({ signal }) => fetchAuctionDetail(auctionUuid, signal),
  })

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<{ price: number }>()

  const mutation = useMutation({
    mutationFn: (data: { price: number }) =>
      postAuctionBet({ auctionUuid, price: data.price }),
    onSuccess: () => {
      addToast('Ставка успешно принята!', 'success')
      // Инвалидируем кэш, чтобы списки и деталка обновились
      queryClient.invalidateQueries({ queryKey: ['auctions'] })
      queryClient.invalidateQueries({
        queryKey: ['auction', 'detail', auctionUuid],
      })
      // Возвращаемся на деталку
      navigate({ to: '/auctions/$auctionUuid', params: { auctionUuid } })
    },
    onError: (error: any) => {
      // Обработка 422 ошибок
      const apiErrors = error.response?.data?.errors
      if (apiErrors) {
        apiErrors.forEach((err: { field: 'price'; message: string }) => {
          setError(err.field, { message: err.message })
        })
      }
    },
  })

  const onSubmit = (data: { price: number }) => {
    mutation.mutate(data)
  }

  console.log(detailData)

  return (
    <>
      <div>Hello "/auctions/$auctionUuid/bet"!{auctionUuid}</div>
      <div>Текущая цена: {detailData?.trading?.price?.current} ₽</div>
      <div>Доступная цена: {detailData?.trading?.price?.available} ₽</div>
      <div>Шаг ставки: {detailData?.trading?.price?.step} ₽</div>
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            ваша ставка
            <input
              type="number"
              {...register('price', {
                valueAsNumber: true,
                required: 'укажите цену',
                min: { value: 1, message: 'цена должна быть больше 0' },
              })}
            />
          </label>

          {errors.price && (
            <div style={{ color: 'red' }}>{errors.price.message}</div>
          )}

          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Отправка…' : 'Отправить ставку'}
          </button>
        </form>
      </>
    </>
  )
}
