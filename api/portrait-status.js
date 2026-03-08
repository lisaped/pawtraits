module.exports = async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { requestId } = req.query;
  if (!requestId) return res.status(400).json({ error: "Missing requestId" });

  const FAL_KEY = process.env.FAL_API_KEY;
  if (!FAL_KEY) return res.status(500).json({ error: "FAL_API_KEY not configured" });

  try {
    const statusResp = await fetch(
      `https://queue.fal.run/fal-ai/flux/dev/image-to-image/requests/${requestId}/status`,
      { headers: { "Authorization": `Key ${FAL_KEY}` } }
    );

    if (!statusResp.ok) {
      return res.status(500).json({ error: "Failed to check status" });
    }

    const { status } = await statusResp.json();

    if (status === "COMPLETED") {
      const resultResp = await fetch(
        `https://queue.fal.run/fal-ai/flux/dev/image-to-image/requests/${requestId}`,
        { headers: { "Authorization": `Key ${FAL_KEY}` } }
      );
      const resultData = await resultResp.json();
      const imageUrl = resultData?.images?.[0]?.url;
      if (!imageUrl) return res.status(500).json({ error: "No image in result" });
      return res.status(200).json({ status: "COMPLETED", imageUrl });
    }

    if (status === "FAILED") {
      return res.status(500).json({ status: "FAILED", error: "Generation failed" });
    }

    return res.status(200).json({ status: status || "IN_QUEUE" });

  } catch (err) {
    console.error("portrait-status error:", err.message);
    return res.status(500).json({ error: err.message });
  }
};
