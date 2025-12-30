import { headers } from "next/headers";

async function getPaste(id: string) {
  const h = await headers();
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(
    `${protocol}://${host}/api/paste/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
    const {id} = await params
  const data = await getPaste(id);

  if (!data) {
    return <h1>Paste not found</h1>;
  }

  return (
    <pre style={{ whiteSpace: "pre-wrap" }}>
      {data.content}
    </pre>
  );
}
