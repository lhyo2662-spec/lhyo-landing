import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slot = url.searchParams.get("slot") || "";
  const ceo = url.searchParams.get("ceo") || "Cliente";
  const email = url.searchParams.get("email") || "";
  const empresa = url.searchParams.get("empresa") || "No especificada";
  const plan = url.searchParams.get("plan") || "Auditoría Lhyo Group";

  let datePart = "2026-10-26";
  let timePart = "11:00 AM";
  if (slot.includes("|")) {
    const parts = slot.split("|");
    datePart = parts[0].trim();
    timePart = parts[1].trim();
  }

  const [year, month, day] = datePart.split("-").map((n) => parseInt(n, 10) || 2026);
  let hour = 11;
  let minute = 0;

  const timeMatch = timePart.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (timeMatch) {
    hour = parseInt(timeMatch[1], 10);
    minute = parseInt(timeMatch[2], 10);
    const ampm = timeMatch[3].toUpperCase();
    if (ampm === "PM" && hour < 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
  }

  const startUtc = new Date(Date.UTC(year, month - 1, day, hour + 3, minute, 0));
  const endUtc = new Date(startUtc.getTime() + 30 * 60 * 1000);

  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const datesParam = `${fmt(startUtc)}/${fmt(endUtc)}`;

  const title = `Reunión Lhyo Group: ${ceo} (${empresa})`;
  const details = `Ejecutivo / Cliente: ${ceo}\nCorreo: ${email}\nEmpresa: ${empresa}\nServicio: ${plan}\n\nCatálogo Privado: https://lhyogroup.vercel.app/api/dossier?ceo=${encodeURIComponent(ceo)}&empresa=${encodeURIComponent(empresa)}`;

  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${datesParam}&details=${encodeURIComponent(details)}&add=${encodeURIComponent(email)},lhyoaraque2662@gmail.com`;

  return NextResponse.redirect(gcalUrl, 302);
}
