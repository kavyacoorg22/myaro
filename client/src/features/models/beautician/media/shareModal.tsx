import { useRef, useState } from "react";
import type { PostType, ShareModalProps, ShareStep } from "../../../types/mediaType";
import { ArrowLeft, Check } from "lucide-react";
import { MediaSlideshow } from "./mediaSlideShow";
import { LocationSearch, type LocationResult } from "../../../shared/locationSearch";

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  mediaItems,
  user,
  onBack,
  onClose,
  onShare,
}) => {
  const [step, setStep] = useState<ShareStep>("form");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [postType, setPostType] = useState<PostType>("reel");
  const descRef = useRef<HTMLTextAreaElement>(null);

  const MAX_DESC = 2000;

const handleShare = async () => {
  setStep("sharing");
  try {
    // convert blob URLs to File objects
    const files = await Promise.all(
      mediaItems.map(async (item, index) => {
        const response = await fetch(item.src);
        const blob = await response.blob();
        const ext = item.fileType === 'video' ? 'mp4' : 'jpg';
        return new File([blob], `media-${index}.${ext}`, { type: blob.type });
      })
    );

    const formData = new FormData();
    formData.append('description', description);
    formData.append('postType', postType);
    if (location) formData.append('location', JSON.stringify(location));
    files.forEach(file => formData.append('media', file));

    await onShare(formData);
    setStep("posted");
  } catch {
    setStep("form");
  }
};

  const handleClose = () => {
    setStep("form");
    setDescription("");
    setLocation(null);
    setPostType("reel");
    onClose();
  };

  if (!isOpen) return null;

  // ── Sharing spinner ──
  if (step === "sharing") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div
          className="bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-4 p-10"
          style={{ width: 280 }}
        >
          <p className="text-sm font-semibold text-gray-700">Sharing</p>
          <div className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  // ── Posted success ──
  if (step === "posted") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div
          className="bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-4 p-10"
          style={{ width: 280 }}
        >
          <p className="text-sm font-semibold text-gray-700">Posted</p>
          <div className="w-16 h-16 rounded-full border-4 border-purple-500 flex items-center justify-center">
            <Check className="w-7 h-7 text-blue-500" />
          </div>
          <p className="text-sm text-gray-500">Your post has been shared</p>
          <button
            onClick={handleClose}
            className="mt-2 px-6 py-2 bg-purple-500 text-white text-sm font-semibold rounded-xl hover:bg-purple-600 transition"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // ── Main form ──
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ width: 640 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-gray-100 transition text-gray-600"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-sm font-semibold text-gray-900">Create New Post</h2>
          <button
            onClick={handleShare}
            className="text-sm font-semibold text-blue-500 hover:text-blue-700 transition"
          >
            Share
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex" style={{ height: 380 }}>

          {/* Left: slideshow */}
          <div className="w-80 flex-shrink-0 bg-gray-100">
            <MediaSlideshow items={mediaItems} />
          </div>

          {/* Right: form */}
          <div className="flex-1 flex flex-col overflow-y-auto px-5 py-4 gap-4">

            {/* User info */}
            <div className="flex items-center gap-3">
              <img
                src={user.profileImg ?? `https://ui-avatars.com/api/?name=${user.userName}`}
                alt={user.userName}
                className="w-9 h-9 rounded-full object-cover"
              />
              <span className="text-sm font-semibold text-gray-900">{user.userName}</span>
            </div>

            {/* Description */}
            <div>
              <textarea
                ref={descRef}
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESC))}
                placeholder="Write a description..."
                rows={4}
                className="w-full text-sm text-gray-700 placeholder-gray-300 resize-none outline-none border-none"
              />
              <p className="text-right text-xs text-gray-400">
                {description.length}/{MAX_DESC}
              </p>
            </div>

            {/* Location */}
            <LocationSearch
              placeholder="Add location..."
              initialValue={location?.formattedString ?? undefined}
              onSelect={(result) => setLocation(result)}
              onClear={() => setLocation(null)}
            />

            {/* Post type */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Choose any one</p>
              <div className="flex flex-col gap-2">
                {(["reel", "tips", "rent"] as PostType[]).map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setPostType(type)}
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition
                        ${postType === type ? "border-purple-500" : "border-gray-300"}`}
                    >
                      {postType === type && (
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                      )}
                    </div>
                    <span className="text-sm text-gray-700 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};