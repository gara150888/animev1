import { auth } from "@Zlo/auth";
import { getContentById, importSeasons } from "@Zlo/api/server/services/content";
import { seasonsImportSchema } from "@Zlo/zod/content";
import { headers } from "@/helper";
import { NextResponse } from "next/server";

const decode = (s: string) =>
  s.replace(/&(#39|amp|quot|lt|gt|nbsp);/g, (m) => ({ "&#39;": "'", "&amp;": "&", "&quot;": '"', "&lt;": "<", "&gt;": ">", "&nbsp;": " " }[m] || ""));

async function fetchSeriesSeasons(slug: string) {
  const baseUrl = "https://tooniboy.xyz";
  const res = await fetch(`${baseUrl}/series/${slug}`, {
    headers: { ...headers, Referer: baseUrl },
  });

  if (!res.ok) return null;

  const html = await res.text();

  const rawTitle = html.match(/<h1[^>]*class="[^"]*\bentry-title\b[^"]*"[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "";
  const seriesTitle = decode(rawTitle.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();

  const seasons = Array.from(
    html.matchAll(/<a\b[^>]*\bclass="[^"]*\bseason-btn\b[^"]*"[^>]*\bdata-season="(\d+)"[^>]*>([\s\S]*?)<\/a>/gi),
    ([, season, label]) => ({
      seasonNumber: Number(season),
      title: label.trim().slice(0, 255),
    })
  );

  return { seriesTitle, seasons };
}

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const data = await fetchSeriesSeasons(id);
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

  const parsed = seasonsImportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const { contentId, slug } = parsed.data;

  const content = await getContentById(contentId);
  if (!content) return NextResponse.json({ error: "Content not found" }, { status: 404 });

  const data = await fetchSeriesSeasons(slug);
  if (!data) return NextResponse.json({ error: "Upstream request failed" }, { status: 502 });

  const created = await importSeasons(contentId, data.seasons);

  return NextResponse.json({
    seriesTitle: data.seriesTitle,
    created,
    skipped: data.seasons.length - created.length,
  });
}
