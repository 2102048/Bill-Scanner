export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { image, mimeType } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; 
  const apiUrl = process.env.GEMINI_API_URL; 

  if (!apiKey || !apiUrl) {
    return res.status(500).json({ error: "API Keys missing in Vercel settings" });
  }

  try {
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "Extract receipt items. Return ONLY JSON: { \"scannedItems\": [{\"name\": \"string\", \"price\": 0.0}], \"detectedTax\": 0.0 }" },
            { inlineData: { mimeType, data: image } }
          ]
        }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Gemini scan failed" });
  }
}