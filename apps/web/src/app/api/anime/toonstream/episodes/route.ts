import { auth } from "@Zlo/auth";
import { getSeasonById, importEpisodes } from "@Zlo/api/server/services/content";
import { episodesImportSchema } from "@Zlo/zod/content";
import { headers } from "@/helper";
import { NextResponse } from "next/server";

const decode = (s: string) =>
  s.replace(/&(#39|amp|quot|lt|gt|nbsp);/g, (m) => ({ "&#39;": "'", "&amp;": "&", "&quot;": '"', "&lt;": "<", "&gt;": ">", "&nbsp;": " " }[m] || ""));

type ParsedEpisode = {
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  thumbnail: string | null;
  url: string;
};

async function fetchSeasonEpisodes(slug: string, season: number) {
  const baseUrl = "https://tooniboy.xyz";
  const res = await fetch(`${baseUrl}/series/${slug}/season/${season}`, {
    headers: { ...headers, Referer: baseUrl },
  });

  if (!res.ok) return null;

  const html = await res.text();

  const rawTitle = html.match(/<h1[^>]*class="[^"]*\bentry-title\b[^"]*"[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "";
  const seriesTitle = decode(rawTitle.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();

  const parsed = Array.from(
    html.matchAll(/<article\b[^>]*\bclass="[^"]*\bepisodes\b[^"]*"[^>]*>([\s\S]*?)<\/article>/gi),
    ([, article]): ParsedEpisode | null => {
      const num = article.match(/<span class="num-epi"[^>]*>\s*([\s\S]*?)\s*<\/span>/)?.[1] ?? "";
      const [seasonRaw, episodeRaw] = num.split("x");
      const seasonNumber = Number(seasonRaw);
      const episodeNumber = Number(episodeRaw);

      if (!Number.isFinite(seasonNumber) || !Number.isFinite(episodeNumber)) return null;

      const title = article.match(/<h5 class="entry-title1"[^>]*>\s*([\s\S]*?)\s*<\/h5>/)?.[1] ?? "";
      const thumbnail = article.match(/<img[^>]*src="([^"]+)"/)?.[1] ?? null;
      const url =
        article.match(/<a\b[^>]*href="([^"]+)"[^>]*class="lnk-blk"/)?.[1] ??
        article.match(/class="lnk-blk"[^>]*href="([^"]+)"/)?.[1] ??
        "";

      return {
        seasonNumber,
        episodeNumber,
        title: title.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 255),
        thumbnail,
        url,
      };
    },
  ).filter((episode): episode is ParsedEpisode => episode !== null);

  const episodes = parsed
    .filter((episode) => episode.seasonNumber === season)
    .map(({ seasonNumber: _seasonNumber, ...episode }) => episode);

  return { seriesTitle, episodes };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const rawSeason = searchParams.get("season");
  let season = 1;
  if (rawSeason !== null) {
    season = Math.trunc(Number(rawSeason));
    if (!Number.isFinite(season)) {
      return NextResponse.json({ error: "Invalid season" }, { status: 400 });
    }
  }

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const data = await fetchSeasonEpisodes(id, season);
  if (!data) return NextResponse.json({ error: "Upstream request failed" }, { status: 502 });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const parsed = episodesImportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const { seasonId, slug } = parsed.data;

  const season = await getSeasonById(seasonId);
  if (!season) return NextResponse.json({ error: "Season not found" }, { status: 404 });

  const data = await fetchSeasonEpisodes(slug, season.seasonNumber);
  if (!data) return NextResponse.json({ error: "Upstream request failed" }, { status: 502 });

  const created = await importEpisodes(seasonId, data.episodes);

  return NextResponse.json({
    seriesTitle: data.seriesTitle,
    created,
    skipped: data.episodes.length - created.length,
  });
}
