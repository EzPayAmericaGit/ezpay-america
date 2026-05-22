import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, CheckCircle2, Loader2, FileText, X, Camera } from "lucide-react";
import { appParams } from "@/lib/app-params";

async function uploadFileDirect(file) {
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const headers = {};
      if (appParams.token) headers["Authorization"] = `Bearer ${appParams.token}`;
      if (appParams.appId) headers["X-App-Id"] = appParams.appId;

      const baseUrl = appParams.serverUrl || "https://api.base44.com";
      const res = await fetch(`${baseUrl}/api/apps/${appParams.appId}/integrations/upload`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(`Server error ${res.status}: ${text}`);
      }

      const data = await res.json();
      if (data?.file_url) return data.file_url;
      throw new Error("No file_url in response");
    } catch (err) {
      lastErr = err;
      if (attempt < 3) await new Promise(r => setTimeout(r, attempt * 2000));
    }
  }
  throw lastErr;
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

    // Allow up to 50MB
    if (file.size > 50 * 1024 * 1024) {
      setError("File size must be less than 50MB.");
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
      const file_url = await uploadFileDirect(file);
      setUploadedUrl(file_url);
      onUpload(file_url);
      console.info(`[DocumentUploader] ✓ ${label} uploaded successfully`);
    } catch (err) {
      console.error(`[DocumentUploader] ✗ ${label} upload failed:`, err.message);
      setError(`Upload failed after 3 attempts: ${err.message}. Please try again or use a smaller/different file.`);
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
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">⚠ {error}</p>
                <p className="text-xs text-red-500 mt-1">Tip: Try a JPG, PNG, PDF, or HEIC under 50MB. If it keeps failing, try a smaller or compressed version of the file.</p>
              </div>
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
                           JPG, PNG, HEIC, or PDF — max 50MB
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