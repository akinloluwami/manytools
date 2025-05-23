import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(tools)/video-trimmer')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(tools)/video-trimmer"!</div>
}
