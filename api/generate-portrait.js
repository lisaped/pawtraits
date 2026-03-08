module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { imageBase64, mediaType, prompt } = req.body || {};
  if (!imageBase64 || !prompt) return res.status(400).json({ error: "Missing imageBase64 or prompt" });

  const FAL_KEY = process.env.FAL_API_KEY;
  if (!FAL_KEY) return res.status(500).json({ error: "FAL_API_KEY not configured" });

  try {
    const dataUri = `data:${mediaType || "image/jpeg"};base64,${imageBase64}`;

    const queueResp = await fetch("https://queue.fal.run/fal-ai/flux/dev/image-to-image", {
      method: "POST",
      headers: {
        "Authorization": `Key ${FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: dataUri,
        prompt: `portrait of a pet, ${prompt}, professional art, high quality, masterpiece`,
        strength: 0.85,
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        image_size: "square_hd",
      }),
    });

    const queueText = await queueResp.text();
    console.log("fal.ai queue response:", queueResp.status, queueText.substring(0, 200));

    if (!queueResp.ok) {
      return res.status(500).json({ error: `fal.ai error (${queueResp.status}): ${queueText}` });
    }

    const { request_id } = JSON.parse(queueText);
    if (!request_id) return res.status(500).json({ error: "No request_id: " + queueText });

    return res.status(200).json({ requestId: request_id });

  } catch (err) {
    console.error("generate-portrait error:", err.message);
    return res.status(500).json({ error: err.message });
  }
};
