
// index.js — Cloudflare Pages Functions Worker

// ─── CONFIG ──────────────────────────────────────────────────────────────
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1374501505167659220/0ZUDpNECKPKY1Asqane7b-Kw5oY2y3MUwHLzknAIg_TsGYCQyDGVYG_1ytDWZVSRImq2"; // your webhook
const BOT_SECRETS = {
  "bot01": "ktb",
  // add more bot IDs and secrets as needed
};
// ─────────────────────────────────────────────────────────────────────────

export async function onRequestPost(context) {
  const url = new URL(context.request.url);
  const path = url.pathname; // "/sign" or "/start"

  if (!(path === "/sign" || path === "/start")) {
    return new Response("Not found", { status: 404 });
  }

  let data;
  try {
    data = await context.request.json();
  } catch {
    return new Response("Bad JSON", { status: 400 });
  }

  const { botId, secret, ts } = data;
  if (!botId || !secret || !ts)
    return new Response("Missing fields", { status: 400 });

  if (BOT_SECRETS[botId] !== secret)
    return new Response("Unauthorized", { status: 401 });

  const timeStr = `<t:${Math.floor(ts / 1000)}:F>`;
  const content = path === "/sign"
    ? `💓 **Heartbeat** from **${botId}** at ${timeStr}`
    : `🚀 **Miner START** for **${botId}** at ${timeStr}`;

  await fetch(DISCORD_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  return new Response("OK", { status: 200 });
}
