import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, CheckCircle2, Loader2, FileText, X } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function DocumentUploader({ 
  label, 
  description, 
  currentUrl, 
  onUpload, 
  accept = "image/*,.pdf" 
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(currentUrl);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setUploadedUrl(file_url);
      onUpload(file_url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setUploadedUrl(null);
    onUpload(null);
  };

  return (
    <Card className="border-2 border-dashed border-gray-300 hover:border-amber-400 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">{label}</h4>
            <p className="text-sm text-gray-500 mb-4">{description}</p>
            
            {uploadedUrl ? (
              <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800 flex-1">Document uploaded</span>
                <a 
                  href={uploadedUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-amber-600 hover:underline"
                >
                  View
                </a>
                <button onClick={handleRemove} className="text-gray-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept={accept}
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
                <div className="flex items-center gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={isUploading}
                    className="pointer-events-none"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Document
                      </>
                    )}
                  </Button>
                </div>
              </label>
            )}
          </div>
          <FileText className="w-10 h-10 text-gray-300" />
        </div>
      </CardContent>
    </Card>
  );
}