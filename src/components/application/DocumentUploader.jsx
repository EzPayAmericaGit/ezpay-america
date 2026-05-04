import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, CheckCircle2, Loader2, FileText, X, Camera, Image } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function DocumentUploader({ 
  label, 
  description, 
  currentUrl, 
  onUpload, 
  accept = "image/*,.pdf",
  required = false
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(currentUrl);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFile = async (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert("Please upload an image (JPG, PNG) or PDF file.");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB.");
      return;
    }

    // Show preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }

    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setUploadedUrl(file_url);
      onUpload(file_url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file. Please try again.");
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    handleFile(e.target.files?.[0]);
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  }, []);

  const handleRemove = () => {
    setUploadedUrl(null);
    setPreview(null);
    onUpload(null);
  };

  const isImage = uploadedUrl?.match(/\.(jpg|jpeg|png|gif)$/i) || preview;

  return (
    <Card className={`border-2 border-dashed transition-all ${
      dragActive ? 'border-amber-500 bg-amber-50' : 
      uploadedUrl ? 'border-green-400 bg-green-50/50' : 
      'border-gray-300 hover:border-amber-400'
    }`}>
      <CardContent 
        className="p-6"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            uploadedUrl ? 'bg-green-500' : 'bg-gray-200'
          }`}>
            {uploadedUrl ? (
              <CheckCircle2 className="w-6 h-6 text-white" />
            ) : (
              <FileText className="w-6 h-6 text-gray-500" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900">{label}</h4>
              {required && <span className="text-red-500 text-sm">*</span>}
            </div>
            <p className="text-sm text-gray-500 mb-4">{description}</p>
            
            {uploadedUrl ? (
              <div className="space-y-3">
                {isImage && (
                  <div className="relative w-full max-w-xs">
                    <img 
                      src={preview || uploadedUrl} 
                      alt="Document preview" 
                      className="rounded-lg border shadow-sm max-h-32 object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-green-700 font-medium">
                    ✓ Document uploaded successfully
                  </span>
                  <a 
                    href={uploadedUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-amber-600 hover:underline font-medium"
                  >
                    View Full Size
                  </a>
                  <button 
                    onClick={handleRemove} 
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <div className={`flex flex-col items-center justify-center py-6 px-4 border-2 border-dashed rounded-lg transition-colors ${
                    dragActive ? 'border-amber-500 bg-amber-100' : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50'
                  }`}>
                    {isUploading ? (
                      <>
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-2" />
                        <span className="text-sm text-gray-600">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm font-medium text-gray-700">
                          Drop file here or click to upload
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          JPG, PNG or PDF (max 10MB)
                        </span>
                      </>
                    )}
                  </div>
                </label>
                
                {/* Mobile camera option */}
                <div className="flex gap-2 md:hidden">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full pointer-events-none"
                      disabled={isUploading}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </Button>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}