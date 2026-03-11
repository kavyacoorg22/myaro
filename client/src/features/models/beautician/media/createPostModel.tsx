import { useCallback, useRef, useState } from "react";
import type { CreatePostModalProps } from "../../../types/mediaType";
import { X } from "lucide-react";

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onFileSelect,
  onNext
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) return;
      setFileType(file.type.startsWith("image/") ? "image" : "video");
      setPreview(URL.createObjectURL(file));
      onFileSelect?.(file);
    },
    [onFileSelect]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleClose = () => {
    setPreview(null);
    setFileType(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleClose}
    >
      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Create New Post</h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition text-gray-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drop Zone */}
        <div className="p-6">
          {!preview ? (
            <div
onDragOver={(e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); }}
onDragLeave={(_e: React.DragEvent<HTMLDivElement>) => setIsDragging(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-xl py-12 px-6 transition-colors cursor-pointer
                ${isDragging ? "border-cyan-400 bg-cyan-50" : "border-gray-200 bg-gray-50 hover:border-cyan-300 hover:bg-cyan-50/40"}`}
              onClick={() => inputRef.current?.click()}
            >
              {/* Icon */}
              <div className="relative">
                <div className="w-16 h-12 border-2 border-gray-400 rounded-md flex items-center justify-center bg-white">
                  <div className="w-5 h-5 border-2 border-gray-400 rounded-sm flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-gray-400 ml-0.5" />
                  </div>
                </div>
                <div className="absolute -top-2 -left-3 w-12 h-9 border-2 border-gray-300 rounded-md bg-white -z-10" />
              </div>

              <p className="text-sm text-gray-500 font-medium">Drag photos and videos here</p>
            </div>
          ) : (
            // Preview
            <div className="relative rounded-xl overflow-hidden aspect-video bg-black">
              {fileType === "image" ? (
                <img src={preview} alt="preview" className="w-full h-full object-contain" />
              ) : (
                <video src={preview} controls className="w-full h-full object-contain" />
              )}
              <button
                onClick={() => { setPreview(null); setFileType(null); }}
                className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white hover:bg-black/80 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleInputChange}
          />

          {/* Select button */}
          {!preview && (
            <button
              onClick={() => inputRef.current?.click()}
              className="mt-5 w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-white text-sm font-semibold transition-colors"
            >
              Select from computer
            </button>
          )}

          {/* Next / Post button (shown after file selected) */}
      {preview && (
  <button
    onClick={() => {
      if (preview && fileType) {
        onNext(preview, fileType); 
        setPreview(null);
        setFileType(null);
      }
    }}
    className="mt-4 w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-white text-sm font-semibold transition-colors"
  >
    Next
  </button>
)}
        </div>
      </div>
    </div>
  );
};