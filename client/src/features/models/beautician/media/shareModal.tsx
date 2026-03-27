import { useState } from "react";
import type { PostType, ShareModalProps, ShareStep } from "../../../types/mediaType";
import { ArrowLeft, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { LocationSearch, type LocationResult } from "../../../shared/locationSearch";
import type { ISignedUrl } from "../../../../types/api/public";
import { publicAPi } from "../../../../services/api/public";
import { BeauticianApi } from "../../../../services/api/beautician";

// ── Inline slideshow ───────────────────────────────────────────────────────
const MediaSlideshow: React.FC<{ items: { src: string; fileType: "image" | "video" }[] | import("../../../types/mediaType").MediaItemWithTrim[] }> = ({ items }) => {
  const [current, setCurrent] = useState(0);
  if (items.length === 0) return null;
  const item = items[current];

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {item.fileType === "image" ? (
        <img src={item.src} alt={`slide-${current}`} className="w-full h-full object-cover" />
      ) : (
        <video key={item.src} src={item.src} className="w-full h-full object-cover" autoPlay muted loop playsInline />
      )}

      {items.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((i) => (i - 1 + items.length) % items.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1 hover:bg-black/70 transition"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => setCurrent((i) => (i + 1) % items.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1 hover:bg-black/70 transition"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            {current + 1}/{items.length}
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all ${i === current ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ── Upload phase labels ────────────────────────────────────────────────────
type UploadPhase = "getting-urls" | "uploading" | "saving" | "done";

const phaseLabel: Record<UploadPhase, string> = {
  "getting-urls": "Preparing upload...",
  uploading: "Uploading media...",
  saving: "Processing & saving post...",
  done: "Posted!",
};

// ── ShareModal ─────────────────────────────────────────────────────────────
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
  const [postType, setPostType] = useState<PostType>("post");
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>("getting-urls");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const MAX_DESC = 2000;

  // ── Full upload flow ───────────────────────────────────────────────────────
  const handleShare = async () => {
    setStep("sharing");
    setUploadProgress(0);
    setErrorMsg("");

    try {
      // ── Step 1: Get presigned S3 upload URLs via API ───────────────────────
      setUploadPhase("getting-urls");

      // Fetch each blob first so we know the real file size for validation
      const blobs: Blob[] = await Promise.all(
        mediaItems.map((item) => fetch(item.src).then((r) => r.blob()))
      );

      const signedUrlRes = await publicAPi.getSignedUploadUrls(
        mediaItems.map((item, index) => ({
          index,
          fileType: item.fileType === "video" ? "video/mp4" : "image/jpeg",
          fileSize: blobs[index].size,  // real size in bytes
        }))
      );

      const signedUrls = signedUrlRes.data?.data;
      if (!signedUrls?.length) throw new Error("Failed to get upload URLs");

      setUploadProgress(10);

      // ── Step 2: Upload each file directly to S3 ────────────────────────────
      setUploadPhase("uploading");

      const s3Keys: string[] = new Array(mediaItems.length);
      const progressPerFile = 70 / mediaItems.length;

      await Promise.all(
        signedUrls.map(async ({ index, signedUrl, s3Key }:ISignedUrl) => {
          // Reuse already-fetched blob — no double download
          const blob = blobs[index];

          // PUT directly to S3 — signed URL handles auth, no extra headers needed
          const uploadRes = await fetch(signedUrl, {
            method: "PUT",
            headers: { "Content-Type": blob.type },
            body: blob,
          });

          if (!uploadRes.ok) throw new Error(`Upload failed for item ${index}`);

          s3Keys[index] = s3Key;
          setUploadProgress((p) => Math.min(p + progressPerFile, 80));
        })
      );

      setUploadProgress(82);

      // ── Step 3: Create post via API — s3Keys + trim data ──────────────────
      setUploadPhase("saving");

      await BeauticianApi.createPost({
        description,
        postType,
        location: location ?? undefined,
        media: mediaItems.map((item, index) => ({
          s3Key: s3Keys[index],
          fileType: item.fileType,
          trimStart: item.trimStart,
          trimEnd: item.trimEnd,
          soundOn: item.soundOn,
        })),
      });

      setUploadProgress(100);
      setUploadPhase("done");
      setStep("posted");
    } catch (err: any) {
      console.error("[ShareModal] upload error:", err);
      setErrorMsg(err?.message ?? "Something went wrong");
      setStep("form");
    }
  };

  const handleClose = () => {
    setStep("form");
    setDescription("");
    setLocation(null);
    setPostType("post");
    setUploadProgress(0);
    setErrorMsg("");
    onClose();
  };

  if (!isOpen) return null;

  // ── Uploading ──────────────────────────────────────────────────────────────
  if (step === "sharing") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-5 p-10" style={{ width: 300 }}>
          <p className="text-sm font-semibold text-gray-700">{phaseLabel[uploadPhase]}</p>
          <div className="relative w-16 h-16">
            <div className="w-16 h-16 rounded-full border-4 border-gray-100" />
            <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">{Math.round(uploadProgress)}%</p>
        </div>
      </div>
    );
  }

  // ── Posted ─────────────────────────────────────────────────────────────────
  if (step === "posted") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-4 p-10" style={{ width: 280 }}>
          <div className="w-16 h-16 rounded-full border-4 border-purple-500 flex items-center justify-center">
            <Check className="w-7 h-7 text-purple-500" />
          </div>
          <p className="text-sm font-semibold text-gray-800">Your post has been shared!</p>
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

  // ── Main form ──────────────────────────────────────────────────────────────
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
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <button onClick={onBack} className="p-1.5 rounded-full hover:bg-gray-100 transition text-gray-600">
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

        {/* Error banner */}
        {errorMsg && (
          <div className="px-5 py-2 bg-red-50 border-b border-red-100 text-xs text-red-600">
            ⚠ {errorMsg} — please try again
          </div>
        )}

        {/* Body */}
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
                src={user.profileImg ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.userName)}`}
                alt={user.userName}
                className="w-9 h-9 rounded-full object-cover"
              />
              <span className="text-sm font-semibold text-gray-900">{user.userName}</span>
            </div>

            {/* Description */}
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESC))}
                placeholder="Write a description..."
                rows={4}
                className="w-full text-sm text-gray-700 placeholder-gray-300 resize-none outline-none border-none"
              />
              <p className="text-right text-xs text-gray-400">{description.length}/{MAX_DESC}</p>
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
                {(["post", "tips", "rent"] as PostType[]).map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setPostType(type)}
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition
                        ${postType === type ? "border-purple-500" : "border-gray-300"}`}
                    >
                      {postType === type && <div className="w-2 h-2 rounded-full bg-purple-500" />}
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