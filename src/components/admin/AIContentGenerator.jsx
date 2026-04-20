import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { Sparkles, X, Eye, Check, Loader2, ChevronDown, ChevronUp } from "lucide-react";

function DiffSection({ label, original, generated }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 text-sm font-semibold text-gray-700 hover:bg-gray-100"
      >
        <span>{label}</span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {expanded && (
        <div className="grid grid-cols-2 divide-x divide-gray-200 text-sm">
          <div className="p-3 bg-red-50">
            <p className="text-xs text-red-500 font-medium mb-1 uppercase tracking-wide">Current</p>
            <p className="text-gray-600 whitespace-pre-wrap">{original}</p>
          </div>
          <div className="p-3 bg-green-50">
            <p className="text-xs text-green-600 font-medium mb-1 uppercase tracking-wide">Generated</p>
            <p className="text-gray-800 whitespace-pre-wrap">{generated}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AIContentGenerator({ pageName, currentContent, onPublish }) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [step, setStep] = useState("prompt"); // prompt | preview

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke("generatePageContent", {
        pageName,
        prompt,
        currentContent
      });
      setPreview(res.data.content);
      setStep("preview");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = () => {
    onPublish(preview);
    setOpen(false);
    setStep("prompt");
    setPreview(null);
    setPrompt("");
  };

  const handleClose = () => {
    setOpen(false);
    setStep("prompt");
    setPreview(null);
    setPrompt("");
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-3 rounded-full shadow-2xl text-sm font-semibold transition-all hover:scale-105"
      >
        <Sparkles className="w-4 h-4" />
        AI Generate Content
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">AI Content Generator</h2>
              <p className="text-xs text-gray-500">{pageName}</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Step tabs */}
        <div className="flex border-b border-gray-200 flex-shrink-0">
          <button
            onClick={() => setStep("prompt")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${step === "prompt" ? "border-purple-600 text-purple-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            1. Prompt
          </button>
          <button
            disabled={!preview}
            onClick={() => preview && setStep("preview")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${step === "preview" ? "border-purple-600 text-purple-600" : "border-transparent text-gray-400"} ${!preview ? "opacity-40 cursor-not-allowed" : "hover:text-gray-700"}`}
          >
            2. Preview Changes
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === "prompt" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructions for AI <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Make the tone more professional and focus on B2B use cases. Emphasize cost savings for healthcare billing."
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">Leave blank to auto-improve and optimize the page.</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm text-purple-800">
                <strong>What will be generated:</strong>
                <ul className="mt-2 space-y-1 list-disc list-inside text-purple-700">
                  <li>Hero headline & subtitle</li>
                  <li>4 feature cards (title + description)</li>
                  <li>8 benefit bullet points</li>
                  <li>4 FAQ questions & answers</li>
                  <li>SEO title, meta description & keywords</li>
                </ul>
              </div>
            </div>
          )}

          {step === "preview" && preview && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500 mb-4">Review changes before publishing. Green = new content, Red = what will be replaced.</p>

              <DiffSection label="Hero Headline" original={currentContent.heroHeadline} generated={preview.heroHeadline} />
              <DiffSection label="Hero Subtitle" original={currentContent.heroSubheadline} generated={preview.heroSubheadline} />

              <DiffSection
                label="Features"
                original={currentContent.features?.map((f, i) => `${i + 1}. ${f.title}: ${f.description}`).join("\n")}
                generated={preview.features?.map((f, i) => `${i + 1}. ${f.title}: ${f.description}`).join("\n")}
              />
              <DiffSection
                label="Benefits"
                original={currentContent.benefits?.join("\n")}
                generated={preview.benefits?.join("\n")}
              />
              <DiffSection
                label="FAQs"
                original={currentContent.faqs?.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n")}
                generated={preview.faqs?.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n")}
              />

              <div className="border border-gray-200 rounded-lg overflow-hidden mb-3">
                <div className="px-4 py-2 bg-gray-50 text-sm font-semibold text-gray-700">SEO Metadata</div>
                <div className="grid grid-cols-2 divide-x divide-gray-200 text-sm">
                  <div className="p-3 bg-red-50 space-y-2">
                    <p className="text-xs text-red-500 font-medium uppercase tracking-wide">Current</p>
                    <p><span className="font-medium">Title:</span> {currentContent.seo?.title}</p>
                    <p><span className="font-medium">Description:</span> {currentContent.seo?.description}</p>
                    <p><span className="font-medium">Keywords:</span> <span className="text-gray-500 text-xs">{currentContent.seo?.keywords?.substring(0, 100)}...</span></p>
                  </div>
                  <div className="p-3 bg-green-50 space-y-2">
                    <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Generated</p>
                    <p><span className="font-medium">Title:</span> {preview.seo?.title}</p>
                    <p><span className="font-medium">Description:</span> {preview.seo?.description}</p>
                    <p><span className="font-medium">Keywords:</span> <span className="text-gray-500 text-xs">{preview.seo?.keywords?.substring(0, 100)}...</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0 rounded-b-2xl">
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <div className="flex gap-3">
            {step === "preview" && (
              <Button variant="outline" onClick={() => setStep("prompt")} className="gap-2">
                <Eye className="w-4 h-4" />
                Edit Prompt
              </Button>
            )}
            {step === "prompt" && (
              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white gap-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Preview</>}
              </Button>
            )}
            {step === "preview" && preview && (
              <Button
                onClick={handlePublish}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white gap-2"
              >
                <Check className="w-4 h-4" />
                Publish Changes
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}