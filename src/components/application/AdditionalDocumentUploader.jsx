import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";

async function uploadFileViaBackend(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64Data = e.target.result.split(',')[1];
        const response = await base44.functions.invoke('uploadDocument', {
          filename: file.name,
          mimeType: file.type,
          base64Data
        });
        const data = response?.data;
        if (data?.file_url) {
          resolve(data.file_url);
        } else {
          reject(new Error(data?.error || 'Upload failed — no URL returned'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export default function AdditionalDocumentUploader({ onUpload }) {
  const [isUploading, setIsUploading] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    // Allow up to 25MB
    if (file.size > 25 * 1024 * 1024) {
      setError("File size must be less than 25MB.");
      return;
    }

    const name = documentName.trim() || file.name;

    setIsUploading(true);
    try {
      const file_url = await uploadFileViaBackend(file);
      onUpload({ name, url: file_url });
      setDocumentName("");
    } catch (err) {
      console.error("Upload error:", err);
      setError("Upload failed. Please try again.");
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
              Add Document (JPG, PNG, HEIC or PDF — max 25MB)
            </>
          )}
        </Button>
      </label>
    </div>
  );
}