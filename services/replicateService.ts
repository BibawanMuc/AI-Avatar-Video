const REPLICATE_API_TOKEN = import.meta.env.VITE_REPLICATE_API_TOKEN;

// Proxy/Server side helper usually needed for Replicate to hide key, 
// but for this local Kiosk app we call directly from client (User is aware).
// NOTE: We use a Vite Proxy at /api/replicate to bypass CORS errors.

export const generateVideo = async (imageUrl: string, audioUrl: string): Promise<string> => {
    if (!REPLICATE_API_TOKEN) throw new Error("VITE_REPLICATE_API_TOKEN is missing");

    // 1. Start Prediction
    console.log("Starting Replicate Prediction (via Proxy)...");

    // Call our local proxy: /api/replicate/models/... -> https://api.replicate.com/v1/models/...
    const startResponse = await fetch("/api/replicate/models/wan-video/wan-2.2-s2v/predictions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
            "Prefer": "wait" // Attempt to wait for result immediately
        },
        body: JSON.stringify({
            input: {
                image: imageUrl,
                audio: audioUrl,
                prompt: "Person talking, looking at camera, realistic movement",
                interpolate: false,
                num_frames_per_chunk: 81
            }
        })
    });

    if (!startResponse.ok) {
        const err = await startResponse.text();
        console.error("Replicate Start Error", err);
        throw new Error(`Replicate Error: ${startResponse.statusText}. Proxy might differ?`);
    }

    let prediction = await startResponse.json();
    console.log("Prediction started:", prediction.id);

    // 2. Poll for completion if not already done
    while (prediction.status !== "succeeded" && prediction.status !== "failed" && prediction.status !== "canceled") {
        await new Promise(r => setTimeout(r, 2000)); // Wait 2s

        // Proxy Call: /api/replicate/predictions/... -> https://api.replicate.com/v1/predictions/...
        const pollResponse = await fetch(`/api/replicate/predictions/${prediction.id}`, {
            headers: {
                "Authorization": `Bearer ${REPLICATE_API_TOKEN}`,
            }
        });

        if (!pollResponse.ok) {
            throw new Error("Polling failed");
        }

        prediction = await pollResponse.json();
        console.log("Polling status:", prediction.status);
    }

    if (prediction.status === "failed") {
        throw new Error("Video generation failed: " + JSON.stringify(prediction.error));
    }

    return prediction.output; // This should be the video URL
};
