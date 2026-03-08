module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { imageBase64, mediaType } = req.body || {};
  if (!imageBase64 || !mediaType) return res.status(400).json({ error: "Missing imageBase64 or mediaType" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 200,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
            { type: "text", text: "Describe this pet in 2 warm, poetic sentences as if writing marketing copy for a luxury portrait — mention breed if identifiable, personality suggested by expression, and one charming physical detail. Be concise and enchanting." }
          ]
        }]
      })
    });

    const data = await response.json();
    const description = data.content?.find(b => b.type === "text")?.text || "";
    return res.status(200).json({ description });

  } catch (err) {
    console.error("describe-pet error:", err.message);
    return res.status(500).json({ error: err.message });
  }
};
