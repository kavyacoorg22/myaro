import React from "react";
import type { ViewMode, ProfileData, ProfileActions } from "./types";
import { BeauticianOwnButtons, CustomerOwnButtons } from "./profileActionButton";

interface Props extends ProfileData, ProfileActions {
  viewMode: ViewMode;
}

export const ProfileHeader: React.FC<Props> = ({
  viewMode,
  userName,
  fullName,
  profileImg,
  hideButtons = false,
  yearsOfExperience,
  shopName,
  shopAddress,
  shopCity,
  homeServiceCount,
  isVerified,
  role,
  ...rest
}) => {
  return (
    <div className="bg-white">
      {/* Hero banner strip */}
      <div
        className="h-30 w-full relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #fdf2f4 0%, #fce7eb 40%, #fdf6ee 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute -top-8 -right-8 w-48 h-48 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, #f9a8c9 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-4 left-1/3 w-32 h-32 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #fbbf7a 0%, transparent 70%)" }}
        />
      </div>

      {/* Profile content - overlaps banner */}
      <div className="px-8 pb-6 relative">
        {/* Avatar + action buttons row */}
        <div className="flex items-end justify-between -mt-14 mb-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg"
              style={{ background: "#99f6e4" }}
            >
              {profileImg ? (
                <img
                  src={profileImg}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-4xl font-semibold">
                  {userName?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {isVerified && (
              <div
                className="absolute bottom-1 right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center"
                style={{ background: "#14b8a6" }}
                title="Verified"
              >
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Action buttons aligned to right */}
          {!hideButtons && (viewMode === "own-beautician" || viewMode === "own-customer") && (
            <div className="mb-1">
              {viewMode === "own-beautician" && (
                <BeauticianOwnButtons {...rest} isVerified={isVerified} role={role} />
              )}
              {viewMode === "own-customer" && <CustomerOwnButtons {...rest} />}
            </div>
          )}

          {/* view-beautician top-right buttons */}
          {!hideButtons && viewMode === "view-beautician" && (
            <div className="mb-1 flex gap-2 shrink-0">
              <button
                onClick={rest.onServicePage}
                className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:shadow-md active:scale-95"
                style={{ background: "#0d9488" }}
              >
                Service Page
              </button>
              <button
                onClick={rest.onCalender}
                className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:shadow-md active:scale-95"
                style={{ background: "#0d9488" }}
              >
                Calendar
              </button>
            </div>
          )}
        </div>

        {/* Name */}
        <div className="mb-3">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">
            {userName}
          </h1>
          {fullName && (
            <p className="text-sm text-gray-500 mt-0.5 font-medium">{fullName}</p>
          )}
        </div>

        {/* About */}
        {isVerified && rest.about && (
          <p className="text-sm text-gray-600 mb-4 max-w-xl leading-relaxed">
            {rest.about}
          </p>
        )}

        {/* Stats row */}
        {isVerified && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-4">
            {/* Shop */}
            {shopName && (
              <div className="flex items-center gap-1.5 text-sm">
                <svg className="w-4 h-4 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="font-semibold text-gray-800">{shopName}</span>
              </div>
            )}

            {/* Address */}
            {shopAddress && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>
                  {shopAddress}
                  {shopCity ? `, ${shopCity}` : ""}
                </span>
              </div>
            )}

            {/* Divider */}
            {(shopName || shopAddress) && <div className="w-px h-4 bg-gray-200" />}

            {/* Experience */}
            {yearsOfExperience !== undefined && (
              <div className="flex items-center gap-1.5 text-sm">
                <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-gray-800">{yearsOfExperience} yrs</span>
                <span className="text-gray-400">experience</span>
              </div>
            )}

            {/* Home service */}
            <div className="flex items-center gap-1.5 text-sm">
              <svg className="w-4 h-4 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-semibold text-rose-500">{homeServiceCount ?? 0}</span>
              <span className="text-gray-400">home services</span>
            </div>
          </div>
        )}

        {/* view-beautician bottom action buttons */}
        {!hideButtons && viewMode === "view-beautician" && (
          <div className="flex items-center gap-2 mt-2 pt-4 border-t border-gray-100">
            <button
              onClick={rest.onMessage}
              className="px-5 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all active:scale-95"
            >
              Message
            </button>
            <button
              onClick={rest.onFollow}
              className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:shadow-md active:scale-95"
              style={{ background: "#92400e" }}
            >
              Follow
            </button>
            <button
              onClick={rest.onBookService}
              className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:shadow-md active:scale-95"
              style={{ background: "#b45309" }}
            >
              Book home service
            </button>
          </div>
        )}
      </div>
    </div>
  );
};