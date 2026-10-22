import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ceo = (url.searchParams.get("ceo") || "EJECUTIVO ACREDITADO").toUpperCase();
  const empresa = (url.searchParams.get("empresa") || "EXPEDIENTE RESERVADO B2B").toUpperCase();

  const filePath = path.join(process.cwd(), "public", "catalogo-v9.html");
  let html = fs.readFileSync(filePath, "utf8");

  html = html.replace(
    "EXPEDIENTE EJECUTIVO ACREDITADO &nbsp;|&nbsp; DIVISIÓN CORPORATIVA B2B",
    `${ceo} &nbsp;|&nbsp; ${empresa}`
  );

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
