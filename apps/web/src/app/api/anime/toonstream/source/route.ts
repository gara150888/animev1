import { headers } from "@/helper";
import { request } from "undici";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const baseUrl = "https://tooniboy.xyz";
  const body = await fetch(`${baseUrl}/episode/${id}`, {
    headers: { ...headers, Referer: baseUrl },
  });

  if (body.status !== 200) return NextResponse.json({ error: "Upstream request failed" });

  const html = await body.text();
  const regex = /<div[^>]*id="options-\d+"[^>]*class="([^"]*)"[^>]*>[\s\S]*?<iframe[^>]+?\b(?:data-src|src)="([^"]+)"/g;

  const servers = Array.from(html.matchAll(regex), ([, classes, rawUrl]) => {
    const url = rawUrl.trim();
    let serverName = "";
    try {
      serverName = new URL(url).hostname.replace(/^www\./, "").split(".")[0];
    } catch {
      serverName = "unknown";
    }

    return {
      serverName,
      url,
      language: null,
      quality: null,
      isActive: classes.split(/\s+/).includes("on"),
    };
  });

  return NextResponse.json({ servers });
}