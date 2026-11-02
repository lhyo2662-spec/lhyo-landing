import { NextResponse } from "next/server";

export const runtime = "edge";

// Función nativa Web Crypto para cifrar en SHA-256 (Estándar obligatorio de Meta CAPI)
async function sha256Hash(value: string): Promise<string> {
  const clean = value.trim().toLowerCase();
  const msgBuffer = new TextEncoder().encode(clean);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      eventName = "ViewContent", // "ViewContent" (VSL visto) o "Schedule" (Cita agendada)
      eventId = `lhyo_${Date.now()}`,
      email = "",
      fullName = "Prospecto VSL",
      company = "Empresa No Especificada",
      revenueUsd = 0,
      slotKey = "Por definir"
    } = body;

    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
    const capiToken = process.env.META_CAPI_ACCESS_TOKEN || "";
    const n8nVslWebhook = process.env.N8N_VSL_WEBHOOK_URL || "";
    const slackWebhookUrl = process.env.SLACK_CEO_WEBHOOK_URL || "";

    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0] || "0.0.0.0";
    const userAgent = request.headers.get("user-agent") || "Mozilla/5.0";

    // 1. Disparo a Meta Conversions API (CAPI) con Deduplicación (event_id)
    let metaStatus = "SKIPPED_NO_TOKEN";
    if (pixelId && capiToken) {
      const hashedEmail = email ? await sha256Hash(email) : undefined;
      const metaPayload = {
        data: [
          {
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventId,
            action_source: "website",
            event_source_url: "https://www.lhyogroup.com",
            user_data: {
              client_ip_address: clientIp,
              client_user_agent: userAgent,
              ...(hashedEmail ? { em: [hashedEmail] } : {})
            },
            custom_data: {
              currency: "USD",
              value: Number(revenueUsd) || 0,
              content_name: "VSL_FACELESS_ENTERPRISE",
              content_category: "Lead VSL - Tráfico Frío"
            }
          }
        ]
      };

      const metaRes = await fetch(
        `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${capiToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(metaPayload)
        }
      );
      metaStatus = `HTTP_${metaRes.status}`;
    }

    // 2. Si el evento es un agendamiento ("Schedule"), interceptar hacia n8n y Slack
    if (eventName === "Schedule") {
      const priority = Number(revenueUsd) >= 5000 ? "VIP_HIGH_TICKET" : "QUALIFIED_VSL";

      const vslLeadData = {
        nombre_cliente: fullName,
        email_cliente: email,
        empresa_web: company,
        facturacion_usd: Number(revenueUsd) || 0,
        horario_cita: slotKey,
        etiqueta_origen: "Lead VSL - Tráfico Frío",
        prioridad_vip: priority
      };

      if (n8nVslWebhook) {
        await fetch(n8nVslWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(vslLeadData)
        }).catch(() => {});
      }

      if (slackWebhookUrl) {
        const slackBlocks = {
          text: `🚨 NUEVO LEAD VSL AGENDADO: ${fullName} (${company})`,
          blocks: [
            {
              type: "header",
              text: {
                type: "plain_text",
                text: "🚨 NUEVO LEAD VSL AGENDADO | LHYO GROUP"
              }
            },
            {
              type: "section",
              fields: [
                { type: "mrkdwn", text: `*👤 Prospecto:*\n${fullName}` },
                { type: "mrkdwn", text: `*🏢 Empresa:*\n${company}` },
                { type: "mrkdwn", text: `*💰 Facturación:*\n$${Number(revenueUsd).toLocaleString()} USD/mes` },
                { type: "mrkdwn", text: `*🏷️ Etiqueta CRM:*\n\`Lead VSL - Tráfico Frío\`` },
                { type: "mrkdwn", text: `*📅 Horario Cita:*\n${slotKey}` },
                { type: "mrkdwn", text: `*⚡ Clasificación:*\n*${priority}*` }
              ]
            }
          ]
        };

        await fetch(slackWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(slackBlocks)
        }).catch(() => {});
      }
    }

    return NextResponse.json({
      status: "VSL_NERVOUS_SYSTEM_OK",
      eventName,
      deduplicationEventId: eventId,
      metaCapiStatus: metaStatus,
      crmTagAssigned: "Lead VSL - Tráfico Frío"
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "CAPI_ERROR";
    return NextResponse.json({ status: "ERROR", message: msg }, { status: 500 });
  }
}
