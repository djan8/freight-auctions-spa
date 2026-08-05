import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <>
      <nav>
        <Link to="/auctions">Аукционы</Link>
        <Link to="/testOff">Test</Link>
      </nav>
      <hr />
      <Outlet />
    </>
  ),
})
