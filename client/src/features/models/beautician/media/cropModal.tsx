import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Plus, X, Crop } from "lucide-react";
import type { CropModalProps } from "../../../types/mediaType";

export const CropModal: React.FC<CropModalProps> = ({
  isOpen,
  preview,
  fileType,
  onBack,
  onClose,
  onNext,
}) => {
  const addMoreRef = useRef<HTMLInputElement>(null);

  const [extras, setExtras] = useState<string[]>([]);
  const [activePreview, setActivePreview] = useState<string>(preview ?? "");
  const [activeFileType, setActiveFileType] = useState<"image" | "video">(fileType ?? "image");

  useEffect(() => {
    if (preview) {
      setActivePreview(preview);
      setActiveFileType(fileType ?? "image");
    }
  }, [preview, fileType]);

  const handleAddMore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExtras((prev) => [...prev, URL.createObjectURL(file)]);
      e.target.value = "";
    }
  };

  const removeExtra = (index: number) => {
    if (activePreview === extras[index]) {
      setActivePreview(preview ?? "");
      setActiveFileType(fileType ?? "image");
    }
    setExtras((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setExtras([]);
    onClose();
  };

 const handleNext = () => {
  if (!activePreview || !activeFileType) return;
  onNext?.({ preview: activePreview, fileType: activeFileType, extras });
};

  if (!isOpen || !preview) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ width: 480 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-gray-100 transition text-gray-600"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <h2 className="text-sm font-semibold text-gray-900">Crop</h2>

          <button
            onClick={handleNext}
            className="text-sm font-semibold text-blue-500 hover:text-blue-700 transition"
          >
            Next
          </button>
        </div>

        {/* ── Main Media Area ── */}
        <div className="relative bg-black" style={{ height: 430 }}>

          {activeFileType === "image" ? (
            <img src={activePreview} alt="active-preview" className="w-full h-full object-cover" />
          ) : (
            <video src={activePreview} className="w-full h-full object-cover" autoPlay muted loop />
          )}

          {/* ── Thumbnail strip — bottom left ── */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">

            {/* Main thumb */}
            <div
              onClick={() => { setActivePreview(preview); setActiveFileType(fileType ?? "image"); }}
              className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 cursor-pointer flex-shrink-0 shadow-md transition
                ${activePreview === preview ? "border-white" : "border-white/40"}`}
            >
              {fileType === "image" ? (
                <img src={preview} alt="main-thumb" className="w-full h-full object-cover" />
              ) : (
                <video src={preview} className="w-full h-full object-cover" />
              )}
            </div>

            {/* Extra thumbs */}
            {extras.map((src, i) => (
              <div
                key={i}
                onClick={() => { setActivePreview(src); setActiveFileType("image"); }}
                className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 cursor-pointer flex-shrink-0 shadow-md transition
                  ${activePreview === src ? "border-white" : "border-white/40"}`}
              >
                <img src={src} alt={`extra-${i}`} className="w-full h-full object-cover" />
                <button
                  onClick={(e) => { e.stopPropagation(); removeExtra(i); }}
                  className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5 hover:bg-black/80 transition"
                >
                  <X className="w-2.5 h-2.5 text-white" />
                </button>
              </div>
            ))}

            {/* Add more */}
            <button
              onClick={() => addMoreRef.current?.click()}
              className="w-14 h-14 rounded-lg border-2 border-dashed border-white/60 flex items-center justify-center bg-black/40 hover:bg-black/60 transition flex-shrink-0 shadow-md"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Crop icon — bottom right */}
          <button className="absolute bottom-3 right-3 bg-black/50 rounded-lg p-2 hover:bg-black/70 transition shadow-md">
            <Crop className="w-4 h-4 text-white" />
          </button>

          <input ref={addMoreRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleAddMore} />
        </div>
      </div>
    </div>
  );
};