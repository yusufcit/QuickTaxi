type SlackOrderPayload = {
  bookingReference: string;
  customerName: string;
  email: string | null;
  items: string[];
  orderTotal: string | number | null;
};

function buildSlackOrderText(payload: SlackOrderPayload): string {
  const itemsText = payload.items.length
    ? payload.items.map((i) => `• ${i}`).join("\n")
    : "• N/A";
  const totalText = payload.orderTotal ?? "N/A";

  return [
    "🚕 New booking placed successfully",
    `Reference: ${payload.bookingReference}`,
    `Customer: ${payload.customerName}`,
    `Email: ${payload.email ?? "N/A"}`,
    "Details:",
    itemsText,
    `Order Total: ${totalText}`,
  ].join("\n");
}

export async function sendOrderSlackAlert(payload: SlackOrderPayload): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const body = {
    text: buildSlackOrderText(payload),
  };

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
