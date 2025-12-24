import React, { useState } from "react";


const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

const UploadBill = ({ setInitialData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const base64Image = await convertFileToBase64(file);

      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64Image,
          mimeType: file.type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze the bill. Please try again.");
      }

      const data = await response.json();

      
      const aiTextResponse = data.candidates[0].content.parts[0].text;
      
      const parsedData = JSON.parse(aiTextResponse);

      setInitialData({
        scannedItems: parsedData.scannedItems || [],
        detectedTax: parsedData.detectedTax || 0,
      });

    } catch (err) {
      console.error("Scan Error:", err);
      setError("Could not read the bill. Make sure the photo is clear.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border-2 border-dashed border-blue-200">
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Scan Receipt
        </h2>
        
        <label className={`
          relative cursor-pointer px-6 py-3 rounded-lg font-medium transition-all
          ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} 
          text-white shadow-lg
        `}>
          <span>{loading ? "AI Analyzing..." : "Upload or Take Photo"}</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileUpload}
            disabled={loading}
          />
        </label>

        {error && (
          <p className="mt-3 text-red-500 text-sm font-medium">{error}</p>
        )}

        {loading && (
          <div className="mt-4 flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
            <p className="text-blue-600 text-sm italic">Gemini is extracting items...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadBill;