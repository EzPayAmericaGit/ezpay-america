import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, CheckCircle2, Loader2, FileText, X, Camera } from "lucide-react";
import { base44 } from "@/api/base44Client";

async function uploadFileViaBackend(file, mimeType, documentType) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64Data = e.target.result.split(',')[1];
        const response = await base44.functions.invoke('uploadDocument', {
          filename: file.name,
          mimeType: mimeType || file.type || 'application/octet-stream',
          base64Data,
          documentType
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

export default function DocumentUploader({ 
  label, 
  description, 
  currentUrl, 
  onUpload, 
  accept = "image/*,.pdf",
  required = false,
  documentType = "document"
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(currentUrl);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const handleFile = async (file) => {
    if (!file) return;
    setError(null);

    // Allow up to 25MB
    if (file.size > 25 * 1024 * 1024) {
      setError("File size must be less than 25MB.");
      return;
    }

    // Detect MIME type from extension if browser returns empty string
    let mimeType = file.type;
    if (!mimeType) {
      const ext = file.name.split('.').pop().toLowerCase();
      const extMap = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp', heic: 'image/heic', heif: 'image/heif', pdf: 'application/pdf' };
      mimeType = extMap[ext] || 'application/octet-stream';
    }

    const allowedExts = ['jpg','jpeg','png','gif','webp','heic','heif','pdf'];
    const ext = file.name.split('.').pop().toLowerCase();
    if (!mimeType.startsWith('image/') && mimeType !== 'application/pdf' && !allowedExts.includes(ext)) {
      setError("Please upload an image (JPG, PNG, HEIC) or PDF file.");
      return;
    }

    if (mimeType.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }

    setIsUploading(true);
    try {
      const file_url = await uploadFileViaBackend(file, mimeType, documentType);
      setUploadedUrl(file_url);
      onUpload(file_url);
    } catch (err) {
      console.error("Upload error:", err);
      setError(`Upload failed: ${err.message}`);
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    handleFile(e.target.files?.[0]);
    // Reset input so same file can be re-selected if needed
    e.target.value = '';
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
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
    setError(null);
    onUpload(null);
  };

  const isImage = preview || (uploadedUrl && !uploadedUrl.endsWith('.pdf'));

  return (
    <Card className={`border-2 border-dashed transition-all ${
      dragActive ? 'border-amber-500 bg-amber-50' : 
      uploadedUrl ? 'border-green-400 bg-green-50/50' : 
      error ? 'border-red-400 bg-red-50/30' :
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
            uploadedUrl ? 'bg-green-500' : error ? 'bg-red-100' : 'bg-gray-200'
          }`}>
            {uploadedUrl ? (
              <CheckCircle2 className="w-6 h-6 text-white" />
            ) : (
              <FileText className={`w-6 h-6 ${error ? 'text-red-400' : 'text-gray-500'}`} />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900">{label}</h4>
              {required && <span className="text-red-500 text-sm">*</span>}
            </div>
            <p className="text-sm text-gray-500 mb-4">{description}</p>
            
            {error && (
              <p className="text-sm text-red-600 mb-3 font-medium">{error}</p>
            )}
            
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
                    accept="image/*,.pdf,.heic,.heif"
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
                        <span className="text-sm text-gray-600">Uploading... please wait</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm font-medium text-gray-700">
                          Drop file here or click to upload
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          JPG, PNG, HEIC or PDF — max 25MB
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