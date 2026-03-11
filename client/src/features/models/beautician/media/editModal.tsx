import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { EditModalProps } from "../../../types/mediaType";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const ffmpeg = new FFmpeg();

export const EditModal: React.FC<EditModalProps> = ({
  isOpen, preview, fileType, onBack, onClose, onNext,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(40);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(40);
  const [soundOn, setSoundOn] = useState(true);
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);
  const [isTrimming, setIsTrimming] = useState(false);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const [ffmpegError, setFfmpegError] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Load ffmpeg with MT core
  useEffect(() => {
    const load = async () => {
      try {
        if (!ffmpeg.loaded) {
          ffmpeg.on('log', ({ message }) => console.log('[ffmpeg]', message));
          await ffmpeg.load({
            coreURL: await toBlobURL(
              'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm/ffmpeg-core.js',
              'text/javascript'
            ),
            wasmURL: await toBlobURL(
              'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm/ffmpeg-core.wasm',
              'application/wasm'
            ),
            workerURL: await toBlobURL(
              'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm/ffmpeg-core.worker.js',
              'text/javascript'
            ),
          });
        }
        setFfmpegLoaded(true);
      } catch (err) {
        console.error("ffmpeg load failed:", err);
        setFfmpegError(true);
      }
    };
    load();
  }, []);

  // Load video duration
  useEffect(() => {
    if (videoRef.current && fileType === "video") {
      const video = videoRef.current;
      const handleMeta = () => {
        if (video.duration && isFinite(video.duration)) {
          setDuration(Math.floor(video.duration));
          setTrimEnd(Math.floor(video.duration));
        }
      };
      video.addEventListener("loadedmetadata", handleMeta);
      return () => video.removeEventListener("loadedmetadata", handleMeta);
    }
  }, [preview, fileType]);

  // Sync sound
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = !soundOn;
  }, [soundOn]);

  // Loop within trim range
  useEffect(() => {
    const video = videoRef.current;
    if (!video || fileType !== "video") return;
    video.currentTime = trimStart;
    const handleTimeUpdate = () => {
      if (video.currentTime >= trimEnd) video.currentTime = trimStart;
    };
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [trimStart, trimEnd, fileType]);

  const getPercent = (val: number) => (val / duration) * 100;

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const val = Math.round(pct * duration);
    const distStart = Math.abs(val - trimStart);
    const distEnd = Math.abs(val - trimEnd);
    if (distStart < distEnd) setTrimStart(Math.min(val, trimEnd - 1));
    else setTrimEnd(Math.max(val, trimStart + 1));
  };

  const handleHandleMouseDown = (handle: "start" | "end") => (e: React.MouseEvent) => {
    e.preventDefault();
    if (handle === "start") setIsDraggingStart(true);
    else setIsDraggingEnd(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!trackRef.current || (!isDraggingStart && !isDraggingEnd)) return;
      const rect = trackRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const val = Math.round(pct * duration);
      if (isDraggingStart) setTrimStart(Math.min(val, trimEnd - 1));
      if (isDraggingEnd) setTrimEnd(Math.max(val, trimStart + 1));
    };
    const handleMouseUp = () => {
      setIsDraggingStart(false);
      setIsDraggingEnd(false);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingStart, isDraggingEnd, trimStart, trimEnd, duration]);

  const handleNext = async () => {
    if (!preview || !fileType) return;

    if (fileType === "video") {
      if (!ffmpegLoaded || ffmpegError) {
        // ffmpeg unavailable — pass original
        console.warn("ffmpeg not loaded, passing original video");
        onNext({ preview, fileType, trimStart, trimEnd, soundOn });
        return;
      }

      setIsTrimming(true);
      try {
        const inputFile = await fetchFile(preview);
        await ffmpeg.writeFile("input.mp4", inputFile);

        const trimDuration = trimEnd - trimStart;
        const audioFlag = soundOn ? [] : ["-an"];

        await ffmpeg.exec([
          "-ss", String(trimStart),     // before -i for accurate seek
          "-i", "input.mp4",
          "-t", String(trimDuration),
          ...audioFlag,
          "-c:v", "libx264",            // re-encode for accurate trim points
          "-c:a", "aac",
          "-movflags", "+faststart",
          "output.mp4"
        ]);

        const data = await ffmpeg.readFile("output.mp4");
        const blob = new Blob(
          [new Uint8Array(data as unknown as ArrayBuffer)],
          { type: "video/mp4" }
        );
        const trimmedUrl = URL.createObjectURL(blob);

        // cleanup ffmpeg virtual fs
        await ffmpeg.deleteFile("input.mp4");
        await ffmpeg.deleteFile("output.mp4");

        onNext({ preview: trimmedUrl, fileType, trimStart: 0, trimEnd: trimDuration, soundOn });
      } catch (err) {
        console.error("Trim failed:", err);
        onNext({ preview, fileType, trimStart, trimEnd, soundOn });
      } finally {
        setIsTrimming(false);
      }
    } else {
      onNext({ preview, fileType, trimStart, trimEnd, soundOn });
    }
  };

  const formatTime = (s: number) => `${s}s`;
  if (!isOpen || !preview) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ width: 480 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white">
          <button onClick={onBack} className="p-1.5 rounded-full hover:bg-gray-100 transition text-gray-600">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-sm font-semibold text-gray-900">Edit</h2>
          <button
            onClick={handleNext}
            disabled={isTrimming}
            className="text-sm font-semibold text-blue-500 hover:text-blue-700 transition disabled:opacity-50"
          >
            {isTrimming ? "Trimming..." : "Next"}
          </button>
        </div>

        {/* ffmpeg status banners */}
        {!ffmpegLoaded && !ffmpegError && fileType === "video" && (
          <div className="px-4 py-2 bg-yellow-50 text-xs text-yellow-700 text-center border-b border-yellow-100">
            Loading video editor...
          </div>
        )}
        {ffmpegError && fileType === "video" && (
          <div className="px-4 py-2 bg-red-50 text-xs text-red-600 text-center border-b border-red-100">
            Trim unavailable — original video will be used
          </div>
        )}

        {/* Trimming overlay */}
        {isTrimming && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
            <p className="text-sm text-gray-600 font-medium">Trimming video...</p>
          </div>
        )}

        {/* Body */}
        <div className="flex" style={{ height: 320 }}>
          <div className="w-1/2 bg-black flex-shrink-0">
            {fileType === "image" ? (
              <img src={preview} alt="edit-preview" className="w-full h-full object-cover" />
            ) : (
              <video
                ref={videoRef}
                src={preview}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted={!soundOn}
              />
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center px-5 gap-6 bg-white">
            {fileType === "video" && (
              <div>
                <p className="text-sm font-bold text-gray-900 mb-3">Trim</p>
                <div
                  ref={trackRef}
                  className="relative h-10 bg-gray-300 rounded-md cursor-pointer select-none"
                  onClick={handleTrackClick}
                >
                  <div
                    className="absolute top-0 h-full bg-gray-500 rounded-md"
                    style={{
                      left: `${getPercent(trimStart)}%`,
                      width: `${getPercent(trimEnd) - getPercent(trimStart)}%`,
                    }}
                  />
                  <div
                    className="absolute top-0 h-full w-3 bg-white border-2 border-gray-600 rounded-l-md cursor-ew-resize flex items-center justify-center"
                    style={{ left: `calc(${getPercent(trimStart)}% - 6px)` }}
                    onMouseDown={handleHandleMouseDown("start")}
                  >
                    <div className="w-0.5 h-4 bg-gray-500 rounded-full" />
                  </div>
                  <div
                    className="absolute top-0 h-full w-3 bg-white border-2 border-gray-600 rounded-r-md cursor-ew-resize flex items-center justify-center"
                    style={{ left: `calc(${getPercent(trimEnd)}% - 6px)` }}
                    onMouseDown={handleHandleMouseDown("end")}
                  >
                    <div className="w-0.5 h-4 bg-gray-500 rounded-full" />
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">{formatTime(0)}</span>
                  <span className="text-xs text-gray-400">{formatTime(Math.round(duration / 2))}</span>
                  <span className="text-xs text-gray-400">{formatTime(duration)}</span>
                </div>
              </div>
            )}

            {fileType === "video" && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800">Sound On</span>
                <button
                  onClick={() => setSoundOn((s) => !s)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${soundOn ? "bg-gray-700" : "bg-gray-300"}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${soundOn ? "translate-x-6" : "translate-x-0"}`}
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};