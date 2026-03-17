import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ZoomIn, ZoomOut, X, FileText, Eye } from "lucide-react";

export default function DocumentPreview({ url, label, trigger }) {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  if (!url) return null;

  const isImage = /\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i.test(url);
  const isPdf = /\.pdf(\?|$)/i.test(url);

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 w-full p-3 bg-gray-50 rounded-lg border hover:bg-amber-50 hover:border-amber-300 transition-colors text-left group"
        >
          <FileText className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span className="flex-1 text-sm font-medium text-gray-700 truncate">{label}</span>
          <Eye className="w-4 h-4 text-gray-400 group-hover:text-amber-600" />
        </button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b flex-shrink-0">
            <DialogTitle className="text-lg font-semibold truncate pr-4">{label}</DialogTitle>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isImage && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
                    disabled={zoom <= 0.5}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-600 w-12 text-center">{Math.round(zoom * 100)}%</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(z => Math.min(3, z + 0.25))}
                    disabled={zoom >= 3}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </>
              )}
              <a href={url} target="_blank" rel="noopener noreferrer" download>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </a>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-auto bg-gray-100 p-4 flex items-start justify-center min-h-0">
            {isImage && (
              <img
                src={url}
                alt={label}
                style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s' }}
                className="max-w-full rounded shadow-lg"
              />
            )}
            {isPdf && (
              <iframe
                src={`${url}#toolbar=1`}
                className="w-full rounded shadow"
                style={{ height: '70vh' }}
                title={label}
              />
            )}
            {!isImage && !isPdf && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Preview not available for this file type.</p>
                <a href={url} target="_blank" rel="noopener noreferrer" download>
                  <Button className="bg-amber-500 hover:bg-amber-600">
                    <Download className="w-4 h-4 mr-2" />
                    Download File
                  </Button>
                </a>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}