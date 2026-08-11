import { useToastStore } from '@/shared/model/toast-store'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => {
    const toasts = useToastStore((state) => state.toasts)
    return (
      <>
        {/*<nav>*/}
        {/*  <Link to="/auctions">Аукционы</Link>*/}
        {/*  <Link to="/testOff">Test</Link>*/}
        {/*</nav>*/}
        {/*<hr />*/}
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {toasts.map((t) => (
            <div
              key={t.id}
              style={{
                padding: '10px 16px',
                borderRadius: 6,
                color: '#fff',
                background:
                  t.type === 'success'
                    ? '#2e7d32'
                    : t.type === 'error'
                      ? '#d32f2f'
                      : '#0288d1',
              }}
            >
              {t.message}
            </div>
          ))}
        </div>
        <Outlet />
        <TanStackRouterDevtools />
      </>
    )
  },
})
