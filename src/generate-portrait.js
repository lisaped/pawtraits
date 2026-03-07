export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { imageBase64, mediaType, prompt } = req.body;
  if (!imageBase64 || !prompt) return res.status(400).json({ error: "Missing required fields" });

  const FAL_KEY = process.env.FAL_API_KEY;
  if (!FAL_KEY) return res.status(500).json({ error: "FAL_API_KEY not configured" });

  try {
    // Step 1: Upload image to fal.ai storage
    const imageBuffer = Buffer.from(imageBase64, "base64");
    const uploadResp = await fetch("https://fal.run/fal-ai/storage/upload", {
      method: "POST",
      headers: {
        "Authorization": `Key ${FAL_KEY}`,
        "Content-Type": mediaType || "image/jpeg",
      },
      body: imageBuffer,
    });

    if (!uploadResp.ok) {
      const err = await uploadResp.text();
      console.error("Upload error:", err);
      return res.status(500).json({ error: "Failed to upload image to fal.ai" });
    }

    const { url: imageUrl } = await uploadResp.json();

    // Step 2: Generate styled portrait using flux image-to-image
    const genResp = await fetch("https://fal.run/fal-ai/flux/dev/image-to-image", {
      method: "POST",
      headers: {
        "Authorization": `Key ${FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: imageUrl,
        prompt: `portrait of a pet, ${prompt}, professional art, high quality, masterpiece`,
        strength: 0.8,
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        image_size: "square_hd",
      }),
    });

    if (!genResp.ok) {
      const err = await genResp.text();
      console.error("Generation error:", err);
      return res.status(500).json({ error: "Image generation failed" });
    }

    const genData = await genResp.json();
    const outputUrl = genData?.images?.[0]?.url;

    if (!outputUrl) {
      return res.status(500).json({ error: "No image returned from fal.ai" });
    }

    return res.status(200).json({ imageUrl: outputUrl });

  } catch (err) {
    console.error("fal.ai error:", err);
    return res.status(500).json({ error: "Generation service error" });
  }
}
