// Cloudflare Pages Function: POST /api/quote
//
// Forwards the "Get a Quote" form to Resend (https://resend.com) so
// submissions land in an inbox instead of needing a database. Requires two
// environment variables set in the Cloudflare Pages project settings:
//
//   RESEND_API_KEY   — API key from your Resend account
//   QUOTE_TO_EMAIL   — where submissions should be delivered (e.g. sales@arvonachemicals.com)
//
// See DEPLOY.md for setup steps.

export async function onRequestPost(context) {
  const { request, env } = context;

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  const { name, business, email, phone, category, products, notes } = data;

  if (!name || !business || !email || !category) {
    return json({ error: "Missing required fields" }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Invalid email" }, 400);
  }

  if (!env.RESEND_API_KEY || !env.QUOTE_TO_EMAIL) {
    return json({ error: "Quote form is not configured yet" }, 503);
  }

  const escapeHtml = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));

  const productList = Array.isArray(products) ? products : [products].filter(Boolean);

  const html = `
    <h2>New quote request — Arvona Chemicals</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Business:</strong> ${escapeHtml(business)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
    <p><strong>Customer Category:</strong> ${escapeHtml(category)}</p>
    <p><strong>Products of Interest:</strong> ${escapeHtml(productList.join(", ") || "None selected")}</p>
    <p><strong>Notes:</strong><br>${escapeHtml(notes || "").replace(/\n/g, "<br>")}</p>
  `;

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Arvona Chemicals Website <onboarding@resend.dev>",
      to: [env.QUOTE_TO_EMAIL],
      reply_to: email,
      subject: `New quote request from ${name} — ${business}`,
      html,
    }),
  });

  if (!resendRes.ok) {
    return json({ error: "Failed to send message" }, 502);
  }

  return json({ ok: true });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
