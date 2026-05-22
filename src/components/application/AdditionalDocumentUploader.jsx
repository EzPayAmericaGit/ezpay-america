import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";

async function uploadFileDirect(file) {
  const base64Data = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await base44.functions.invoke("uploadDocument", {
        filename: file.name,
        mimeType: file.type || "application/octet-stream",
        base64Data,
        documentType: "merchant_application",
      });
      if (res?.data?.file_url) return res.data.file_url;
      throw new Error(res?.data?.error || "No file_url returned");
    } catch (err) {
      lastErr = err;
      if (attempt < 3) await new Promise(r => setTimeout(r, attempt * 2000));
    }
  }
  throw lastErr;
}

export default function AdditionalDocumentUploader({ onUpload }) {
  const [isUploading, setIsUploading] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (file.size > 50 * 1024 * 1024) {
      setError("File size must be less than 50MB.");
      return;
    }

    const name = documentName.trim() || file.name;

    setIsUploading(true);
    try {
      const file_url = await uploadFileDirect(file);
      onUpload({ name, url: file_url });
      setDocumentName("");
    } catch (err) {
      console.error("Upload error:", err);
      setError(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <Input
        placeholder="Document name (optional)"
        value={documentName}
        onChange={(e) => setDocumentName(e.target.value)}
        className="h-12"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <label className="cursor-pointer block">
        <input
          type="file"
          accept="image/*,.pdf,.heic,.heif"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        <Button 
          type="button" 
          variant="outline" 
          className="w-full pointer-events-none h-12"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Document (JPG, PNG, HEIC or PDF — max 50MB)
            </>
          )}
        </Button>
      </label>
    </div>
  );
}