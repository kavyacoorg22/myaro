import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { EditModalProps, MediaItemWithTrim } from "../../../types/mediaType";

export const EditModal: React.FC<EditModalProps> = ({
  isOpen, preview, fileType, extras, onBack, onClose, onNext,
}) => {
  // ── All media in insertion order ──────────────────────────────────────────
  const allMedia = React.useMemo(() => {
    if (!preview || !fileType) return [];
    return [
      { src: preview, fileType },
      ...(extras ?? []),
    ] as { src: string; fileType: "image" | "video" }[];
  }, [preview, fileType, extras]);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Stores trim data per item — sent to backend, no client-side processing
  const trimDataRef = useRef<MediaItemWithTrim[]>([]);

  const currentItem = allMedia[currentIndex];
  const isLast = currentIndex === allMedia.length - 1;
  const isVideo = currentItem?.fileType === "video";
  const totalItems = allMedia.length;

  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);

  // ── Reset when item changes ───────────────────────────────────────────────
  useEffect(() => {
    setTrimStart(0);
    setTrimEnd(0);
    setDuration(0);
    setSoundOn(true);
  }, [currentIndex]);

  // ── Load video duration ───────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;
    const onLoaded = () => {
      if (isFinite(video.duration) && video.duration > 0) {
        setDuration(video.duration);
        setTrimStart(0);
        setTrimEnd(video.duration);
      }
    };
    if (video.readyState >= 1 && isFinite(video.duration) && video.duration > 0) {
      onLoaded();
    } else {
      video.addEventListener("loadedmetadata", onLoaded);
      return () => video.removeEventListener("loadedmetadata", onLoaded);
    }
  }, [currentItem, isVideo]);

  // ── Sync mute ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = !soundOn;
  }, [soundOn]);

  // ── Loop within trim range (preview only) ─────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo || trimEnd === 0) return;
    if (video.currentTime < trimStart || video.currentTime > trimEnd) {
      video.currentTime = trimStart;
    }
    const onTimeUpdate = () => {
      if (video.currentTime >= trimEnd) video.currentTime = trimStart;
    };
    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, [trimStart, trimEnd, isVideo]);

  // ── Drag handles ──────────────────────────────────────────────────────────
  const getPercent = (val: number) => (duration > 0 ? (val / duration) * 100 : 0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!trackRef.current || (!isDraggingStart && !isDraggingEnd)) return;
      const rect = trackRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const val = pct * duration;
      if (isDraggingStart) {
        const newStart = Math.min(val, trimEnd - 0.5);
        setTrimStart(newStart);
        if (videoRef.current) videoRef.current.currentTime = newStart;
      }
      if (isDraggingEnd) setTrimEnd(Math.max(val, trimStart + 0.5));
    };
    const onUp = () => { setIsDraggingStart(false); setIsDraggingEnd(false); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDraggingStart, isDraggingEnd, trimStart, trimEnd, duration]);

  // ── Save trim data and advance ────────────────────────────────────────────
  const saveAndAdvance = (skip = false) => {
    if (!currentItem) return;

    const entry: MediaItemWithTrim = {
      src: currentItem.src,
      fileType: currentItem.fileType,
      trimStart: skip ? 0 : trimStart,
      trimEnd: skip ? duration : trimEnd,
      soundOn,
    };

    trimDataRef.current[currentIndex] = entry;

    if (isLast) {
      const allProcessed = [...trimDataRef.current];
      const primary = allProcessed[0];
      onNext({
        preview: primary.src,
        fileType: primary.fileType,
        trimStart: primary.trimStart,
        trimEnd: primary.trimEnd,
        soundOn: primary.soundOn,
        allProcessed,
      });
      trimDataRef.current = [];
      setCurrentIndex(0);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  // ── Reset on open ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      trimDataRef.current = [];
    }
  }, [isOpen]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return m > 0 ? `${m}:${sec.toString().padStart(2, "0")}` : `${sec}s`;
  };

  if (!isOpen || !currentItem) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ width: 500 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <button
            onClick={() => {
              if (currentIndex === 0) { trimDataRef.current = []; onBack(); }
              else setCurrentIndex((i) => i - 1);
            }}
            className="p-1.5 rounded-full hover:bg-gray-100 transition text-gray-600"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-center">
            <h2 className="text-sm font-semibold text-gray-900">Edit</h2>
            {totalItems > 1 && (
              <span className="text-xs text-gray-400">{currentIndex + 1} / {totalItems}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {totalItems > 1 && !isLast && (
              <button
                onClick={() => saveAndAdvance(true)}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                Skip
              </button>
            )}
            <button
              onClick={() => saveAndAdvance(false)}
              className="text-sm font-semibold text-blue-500 hover:text-blue-700"
            >
              {isLast ? "Next" : "Next →"}
            </button>
          </div>
        </div>

        {/* Progress dots */}
        {totalItems > 1 && (
          <div className="flex justify-center gap-1.5 py-2 border-b border-gray-50">
            {allMedia.map((_, i) => (
              <div key={i} className={`rounded-full transition-all ${
                i === currentIndex ? "w-4 h-1.5 bg-blue-500"
                : i < currentIndex ? "w-1.5 h-1.5 bg-green-400"
                : "w-1.5 h-1.5 bg-gray-200"
              }`} />
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex" style={{ height: 340 }}>
          {/* Preview */}
          <div className="w-1/2 bg-black flex-shrink-0">
            {!isVideo ? (
              <img src={currentItem.src} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <video
                key={currentItem.src}
                ref={videoRef}
                src={currentItem.src}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted={!soundOn}
              />
            )}
          </div>

          {/* Controls */}
          <div className="flex-1 flex flex-col justify-center px-5 gap-5 bg-white">
            {!isVideo && (
              <p className="text-sm text-gray-400 text-center">No edits needed for images</p>
            )}

            {isVideo && (
              <>
                {/* Trim slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-900">Trim</p>
                    {duration > 0 && (
                      <span className="text-xs text-gray-400">
                        {formatTime(trimStart)} – {formatTime(trimEnd)}
                        <span className="text-gray-300 ml-1">({formatTime(trimEnd - trimStart)})</span>
                      </span>
                    )}
                  </div>

                  {duration > 0 ? (
                    <>
                      <div
                        ref={trackRef}
                        className="relative h-10 bg-gray-200 rounded-lg select-none"
                      >
                        {/* Selected range */}
                        <div
                          className="absolute top-0 h-full bg-blue-400/60 rounded-lg pointer-events-none"
                          style={{
                            left: `${getPercent(trimStart)}%`,
                            width: `${getPercent(trimEnd) - getPercent(trimStart)}%`,
                          }}
                        />
                        {/* Start handle */}
                        <div
                          className="absolute top-0 h-full w-4 bg-white border-2 border-blue-500 rounded-l-lg cursor-ew-resize flex items-center justify-center shadow z-10"
                          style={{ left: `calc(${getPercent(trimStart)}% - 8px)` }}
                          onMouseDown={(e) => { e.preventDefault(); setIsDraggingStart(true); }}
                        >
                          <div className="w-0.5 h-4 bg-blue-400 rounded-full" />
                        </div>
                        {/* End handle */}
                        <div
                          className="absolute top-0 h-full w-4 bg-white border-2 border-blue-500 rounded-r-lg cursor-ew-resize flex items-center justify-center shadow z-10"
                          style={{ left: `calc(${getPercent(trimEnd)}% - 8px)` }}
                          onMouseDown={(e) => { e.preventDefault(); setIsDraggingEnd(true); }}
                        >
                          <div className="w-0.5 h-4 bg-blue-400 rounded-full" />
                        </div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-400">{formatTime(0)}</span>
                        <span className="text-xs text-gray-400">{formatTime(duration)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-400">Loading video...</span>
                    </div>
                  )}
                </div>

                {/* Sound toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800">Sound</span>
                  <button
                    onClick={() => setSoundOn((s) => !s)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${soundOn ? "bg-blue-500" : "bg-gray-300"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${soundOn ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};