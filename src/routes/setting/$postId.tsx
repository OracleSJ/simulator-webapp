import { useParams } from "@tanstack/react-router";

export const Route = createFileRoute({
  component: RouteComponent,
})

function RouteComponent() {
  const { postId } = useParams();
  return <div>Post ID: {postId}</div>;
}
