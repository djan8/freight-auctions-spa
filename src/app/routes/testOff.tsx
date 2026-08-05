import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/testOff')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/testOff"!</div>
}
