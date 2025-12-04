import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2, Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AdditionalDocumentUploader({ onUpload }) {
  const [isUploading, setIsUploading] = useState(false);
  const [documentName, setDocumentName] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert("Please upload an image (JPG, PNG) or PDF file.");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB.");
      return;
    }

    const name = documentName.trim() || file.name;

    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onUpload({ name, url: file_url });
      setDocumentName("");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
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
      <label className="cursor-pointer block">
        <input
          type="file"
          accept="image/*,.pdf"
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
              Add Document
            </>
          )}
        </Button>
      </label>
    </div>
  );
}