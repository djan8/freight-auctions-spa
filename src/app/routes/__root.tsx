import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      {/*<nav>*/}
      {/*  <Link to="/auctions">Аукционы</Link>*/}
      {/*  <Link to="/testOff">Test</Link>*/}
      {/*</nav>*/}
      {/*<hr />*/}
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
