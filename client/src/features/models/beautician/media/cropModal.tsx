import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Plus, X, Crop } from "lucide-react";
import type { CropModalProps } from "../../../types/mediaType";

type AspectRatio = "original" | "1:1" | "4:5" | "16:9";

const ASPECT_OPTIONS: { label: string; value: AspectRatio; ratio: number | null; icon: React.ReactNode }[] = [
  {
    label: "Original",
    value: "original",
    ratio: null,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="3" width="16" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M1 12l4-4 3 3 3-3 5 4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <circle cx="13" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "1:1",
    value: "1:1",
    ratio: 1,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="14" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: "4:5",
    value: "4:5",
    ratio: 4 / 5,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="3.5" y="1" width="11" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: "16:9",
    value: "16:9",
    ratio: 16 / 9,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="4" width="16" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

// ── Capture first frame of video as JPEG data URL ─────────────────────────
const captureVideoThumbnail = (src: string): Promise<string> =>
  new Promise((resolve) => {
    const vid = document.createElement("video");
    vid.src = src;
    vid.crossOrigin = "anonymous";
    vid.muted = true;
    vid.playsInline = true;
    vid.currentTime = 0.5;
    const capture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 112;
      canvas.height = 112;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
      vid.removeEventListener("seeked", capture);
    };
    vid.addEventListener("seeked", capture);
    vid.addEventListener("error", () => resolve(""));
    vid.load();
  });

// ── Centre-crop an image to the given aspect ratio via canvas ─────────────
// Returns a new blob URL. If ratio is null (Original) returns src unchanged.
const cropImageToRatio = (src: string, ratio: number | null): Promise<string> => {
  if (ratio === null) return Promise.resolve(src);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const { naturalWidth: sw, naturalHeight: sh } = img;
      let cropW: number, cropH: number;
      if (sw / sh > ratio) {
        cropH = sh; cropW = sh * ratio;
      } else {
        cropW = sw; cropH = sw / ratio;
      }
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(cropW);
      canvas.height = Math.round(cropH);
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(src); return; }
      ctx.drawImage(img, (sw - cropW) / 2, (sh - cropH) / 2, cropW, cropH, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => resolve(blob ? URL.createObjectURL(blob) : src),
        "image/jpeg", 0.92
      );
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = src;
  });
};

export const CropModal: React.FC<CropModalProps> = ({
  isOpen, preview, fileType, onBack, onClose, onNext,
}) => {
  const addMoreRef = useRef<HTMLInputElement>(null);

  type ExtraMedia = { src: string; fileType: "image" | "video"; thumbnail: string };

  const [extras, setExtras] = useState<ExtraMedia[]>([]);
  const [activePreview, setActivePreview] = useState<string>(preview ?? "");
  const [activeFileType, setActiveFileType] = useState<"image" | "video">(fileType ?? "image");
  const [cropRatio, setCropRatio] = useState<AspectRatio>("original");
  const [showCropPanel, setShowCropPanel] = useState(false);
  const [mainThumbnail, setMainThumbnail] = useState<string>(preview ?? "");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (preview) {
      setActivePreview(preview);
      setActiveFileType(fileType ?? "image");
      if (fileType === "video") {
        captureVideoThumbnail(preview).then(setMainThumbnail);
      } else {
        setMainThumbnail(preview);
      }
    }
  }, [preview, fileType]);

  const handleAddMore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const src = URL.createObjectURL(file);
      const type: "image" | "video" = file.type.startsWith("video/") ? "video" : "image";
      const thumbnail = type === "video" ? await captureVideoThumbnail(src) : src;
      setExtras((prev) => [...prev, { src, fileType: type, thumbnail }]);
      e.target.value = "";
    }
  };

  const removeExtra = (index: number) => {
    if (activePreview === extras[index]?.src) {
      setActivePreview(preview ?? "");
      setActiveFileType(fileType ?? "image");
    }
    setExtras((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setExtras([]);
    setShowCropPanel(false);
    onClose();
  };

  // ── Apply canvas crop, respecting whichever item the user clicked ────────
  // activePreview = whichever thumbnail was last clicked = the primary.
  // All other media (original + extras, minus the active one) = extras, in order.
  const handleNext = async () => {
    if (!activePreview || !activeFileType || !preview || !fileType) return;
    setIsProcessing(true);
    try {
      const ratio = ASPECT_OPTIONS.find((o) => o.value === cropRatio)?.ratio ?? null;

      // 1. Crop the actively selected item — this is the primary
      const croppedPrimary =
        activeFileType === "image"
          ? await cropImageToRatio(activePreview, ratio)
          : activePreview;

      // 2. Build ordered list of ALL media: original first, then extras
      const allMedia: { src: string; fileType: "image" | "video" }[] = [
        { src: preview, fileType },
        ...extras.map((e) => ({ src: e.src, fileType: e.fileType })),
      ];

      // 3. Extras = everything except the active one, preserving original order
      const othersInOrder = allMedia.filter((item) => item.src !== activePreview);

      const croppedExtras = await Promise.all(
        othersInOrder.map(async (e) => ({
          src: e.fileType === "image" ? await cropImageToRatio(e.src, ratio) : e.src,
          fileType: e.fileType,
        }))
      );

      onNext?.({ preview: croppedPrimary, fileType: activeFileType, extras: croppedExtras });
    } catch (err) {
      console.error("Crop failed, passing originals:", err);
      const allMedia = [
        { src: preview, fileType },
        ...extras.map((e) => ({ src: e.src, fileType: e.fileType })),
      ];
      const others = allMedia.filter((item) => item.src !== activePreview);
      onNext?.({
        preview: activePreview,
        fileType: activeFileType,
        extras: others,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const MEDIA_HEIGHT = 430;
  const MEDIA_WIDTH = 480;

  const getMediaStyle = (): React.CSSProperties => {
    const selected = ASPECT_OPTIONS.find((o) => o.value === cropRatio);
    if (!selected || selected.ratio === null) {
      return { width: "100%", height: "100%", objectFit: "cover" };
    }
    const containerRatio = MEDIA_WIDTH / MEDIA_HEIGHT;
    let w: number, h: number;
    if (selected.ratio > containerRatio) {
      w = MEDIA_WIDTH; h = MEDIA_WIDTH / selected.ratio;
    } else {
      h = MEDIA_HEIGHT; w = MEDIA_HEIGHT * selected.ratio;
    }
    return { width: w, height: h, objectFit: "cover", flexShrink: 0 };
  };

  if (!isOpen || !preview) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ width: MEDIA_WIDTH }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white">
          <button onClick={onBack} className="p-1.5 rounded-full hover:bg-gray-100 transition text-gray-600">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-sm font-semibold text-gray-900">Crop</h2>
          <button
            onClick={handleNext}
            disabled={isProcessing}
            className="text-sm font-semibold text-blue-500 hover:text-blue-700 transition disabled:opacity-40"
          >
            {isProcessing ? "Cropping..." : "Next"}
          </button>
        </div>

        {/* Processing overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
            <p className="text-sm text-gray-600 font-medium">Applying crop...</p>
          </div>
        )}

        {/* Main media area */}
        <div
          className="relative bg-black flex items-center justify-center overflow-hidden"
          style={{ height: MEDIA_HEIGHT }}
        >
          {activeFileType === "image" ? (
            <img src={activePreview} alt="active-preview" style={getMediaStyle()} />
          ) : (
            <video src={activePreview} style={getMediaStyle()} autoPlay muted loop />
          )}

          {/* Thumbnail strip */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            {/* Main thumb */}
            <div
              onClick={() => { setActivePreview(preview); setActiveFileType(fileType ?? "image"); }}
              className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 cursor-pointer flex-shrink-0 shadow-md transition
                ${activePreview === preview ? "border-white" : "border-white/40"}`}
            >
              {mainThumbnail
                ? <img src={mainThumbnail} alt="main-thumb" className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-gray-800" />}
              {fileType === "video" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/50 rounded-full p-1">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="white"><polygon points="3,2 8,5 3,8" /></svg>
                  </div>
                </div>
              )}
            </div>

            {/* Extra thumbs */}
            {extras.map((extra, i) => (
              <div
                key={i}
                onClick={() => { setActivePreview(extra.src); setActiveFileType(extra.fileType); }}
                className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 cursor-pointer flex-shrink-0 shadow-md transition
                  ${activePreview === extra.src ? "border-white" : "border-white/40"}`}
              >
                {extra.thumbnail
                  ? <img src={extra.thumbnail} alt={`extra-${i}`} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-gray-800" />}
                {extra.fileType === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/50 rounded-full p-1">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="white"><polygon points="3,2 8,5 3,8" /></svg>
                    </div>
                  </div>
                )}
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

          {/* Crop toggle button */}
          <button
            onClick={() => setShowCropPanel((v) => !v)}
            className={`absolute bottom-3 right-3 rounded-lg p-2 transition shadow-md ${
              showCropPanel ? "bg-white/90 text-gray-900" : "bg-black/50 hover:bg-black/70 text-white"
            }`}
          >
            <Crop className="w-4 h-4" />
          </button>

          {/* Crop ratio panel */}
          {showCropPanel && (
            <div
              className="absolute bottom-14 right-3 bg-black/75 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl"
              style={{ width: 180 }}
            >
              {ASPECT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setCropRatio(opt.value); setShowCropPanel(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition
                    ${cropRatio === opt.value ? "bg-white/20 text-white font-semibold" : "text-white/80 hover:bg-white/10"}`}
                >
                  <span className="flex-shrink-0">{opt.icon}</span>
                  <span>{opt.label}</span>
                  {cropRatio === opt.value && (
                    <span className="ml-auto">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7l3.5 3.5L12 3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          <input ref={addMoreRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleAddMore} />
        </div>
      </div>
    </div>
  );
};