import { NextResponse } from "next/server";

const QUERY = `
query ($search: String) {
  Page(page: 1, perPage: 10) {
    media(search: $search, type: ANIME) {
      title { english romaji }
      type
      description(asHtml: false)
      coverImage { extraLarge large medium }
      bannerImage
      startDate { year }
      status
      averageScore
      isAdult
    }
  }
}`;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("q");

  if (!search) return NextResponse.json({ error: "Missing 'q' param" }, { status: 400 });

  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: QUERY, variables: { search } }),
  });

  const { data, errors } = await res.json();

  if (errors) return NextResponse.json({ error: errors[0]?.message }, { status: 502 });

  const formatted = data.Page.media.map((m: any) => {
    const rawTitle = m.title.english || m.title.romaji || "Untitled";
    const title = rawTitle.slice(0, 255);
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 255);

    return {
      title,
      slug,
      type: m.type, // "ANIME"
      description: m.description,
      poster: m.coverImage?.extraLarge ?? null,
      banner: m.bannerImage ?? null,
      releaseYear: m.startDate?.year ?? null,
      status: m.status ?? null, // e.g. "FINISHED", "RELEASING"
      rating: m.averageScore ?? null, // 0-100
      isAdult: m.isAdult ?? false,
    };
  });

  return NextResponse.json(formatted);
}