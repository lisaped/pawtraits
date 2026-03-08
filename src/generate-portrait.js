export const config = { maxDuration: 10 };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { imageBase64, mediaType, prompt } = req.body;
  if (!imageBase64 || !prompt) return res.status(400).json({ error: "Missing required fields" });

  const FAL_KEY = process.env.FAL_API_KEY;
  if (!FAL_KEY) return res.status(500).json({ error: "FAL_API_KEY not configured" });

  try {
    // Step 1: Upload image to fal.ai storage
    const imageBuffer = Buffer.from(imageBase64, "base64");
    const uploadResp = await fetch("https://storage.fal.run", {
      method: "POST",
      headers: {
        "Authorization": `Key ${FAL_KEY}`,
        "Content-Type": mediaType || "image/jpeg",
      },
      body: imageBuffer,
    });

    if (!uploadResp.ok) {
      const errText = await uploadResp.text();
      console.error("Upload failed:", errText);
      return res.status(500).json({ error: "Failed to upload image" });
    }

    const uploadData = await uploadResp.json();
    const imageUrl = uploadData.url;
    if (!imageUrl) return res.status(500).json({ error: "No URL from storage upload" });

    // Step 2: Submit to fal.ai queue — returns immediately with request_id
    const queueResp = await fetch("https://queue.fal.run/fal-ai/flux/dev/image-to-image", {
      method: "POST",
      headers: {
        "Authorization": `Key ${FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: imageUrl,
        prompt: `portrait of a pet, ${prompt}, professional art, high quality, masterpiece`,
        strength: 0.85,
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        image_size: "square_hd",
        enable_safety_checker: false,
      }),
    });

    if (!queueResp.ok) {
      const errText = await queueResp.text();
      console.error("Queue submit failed:", errText);
      return res.status(500).json({ error: "Failed to queue generation job" });
    }

    const { request_id } = await queueResp.json();
    if (!request_id) return res.status(500).json({ error: "No request_id returned" });

    return res.status(200).json({ requestId: request_id });

  } catch (err) {
    console.error("Submit error:", err.message);
    return res.status(500).json({ error: err.message || "Submission failed" });
  }
}
