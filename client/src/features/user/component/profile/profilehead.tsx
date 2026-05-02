import React from "react";
import type { ViewMode, ProfileData, ProfileActions } from "./types";
import {
  BeauticianOwnButtons,
  CustomerOwnButtons,
} from "./profileActionButton";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/appStore";

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
  isFollowing,
  followingCount,
  avgRating,
  totalReviews,
  ...rest
}) => {
  const viewerRole = useSelector((state: RootState) => state.user.currentUser.role);

  return (
    <div className="bg-white">
      {/* Banner */}
      <div
        className="h-36 w-full"
        style={{
          background:
            "linear-gradient(135deg, #3d0a14 0%, #7c1f2e 60%, #b45309 100%)",
        }}
      />

      <div className="px-5 pb-5">
        {/* Avatar + buttons row */}
        <div className="flex items-end justify-between -mt-12 mb-3">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-rose-500">
              {profileImg ? (
                <img
                  src={profileImg}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                  {userName?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {viewMode === "own-customer" && (
              <div className="flex mt-4 border-y border-gray-100">
                <button
                  onClick={rest.onFollowingClick}
                  className="py-3 pr-6 text-left hover:opacity-70 transition-opacity"
                >
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                    Following
                  </p>
                  <p className="text-[13px] font-semibold text-gray-800">
                    {followingCount ?? 0}
                  </p>
                </button>
              </div>
            )}

            {isVerified && (
              <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center">
                <svg
                  className="w-2.5 h-2.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pb-1">
            {!hideButtons && viewMode === "own-beautician" && (
              <BeauticianOwnButtons
                {...rest}
                isVerified={isVerified}
                role={role}
              />
            )}
            {!hideButtons && viewMode === "own-customer" && (
              <CustomerOwnButtons {...rest} />
            )}

            {!hideButtons && viewMode === "view-beautician" && (
              <>
                <button
                  onClick={rest.onServicePage}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                >
                  Service page
                </button>
                <button
                  onClick={rest.onCalender}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "#9b1c3a" }}
                >
                  Calendar
                </button>
              </>
            )}
          </div>
        </div>

        {/* Name & handle */}
        <h1 className="text-[18px] font-bold text-gray-900 leading-tight">
          {fullName || userName}
        </h1>
        {fullName && (
          <p className="text-[13px] text-gray-400 mt-0.5">@{userName}</p>
        )}
        {isVerified && rest.about && (
          <p className="text-[13px] text-gray-500 mt-2 leading-relaxed max-w-lg">
            {rest.about}
          </p>
        )}

        {/* Stats strip */}
        {isVerified && (
          <div className="flex mt-4 border-y border-gray-100">
            {shopName && (
              <div className="flex-1 py-3 pl-0 pr-4 border-r border-gray-100">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                  Shop
                </p>
                <p className="text-[13px] font-semibold text-gray-800 truncate">
                  {shopName}
                </p>
              </div>
            )}
            {(shopAddress || shopCity) && (
              <div className="flex-1 py-3 px-4 border-r border-gray-100">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                  Location
                </p>
                <p className="text-[13px] font-semibold text-gray-800 truncate">
                  {[shopAddress, shopCity].filter(Boolean).join(", ")}
                </p>
              </div>
            )}
            {yearsOfExperience !== undefined && (
              <div className="flex-1 py-3 px-4 border-r border-gray-100">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                  Experience
                </p>
                <p className="text-[13px] font-semibold text-gray-800">
                  {yearsOfExperience} yrs
                </p>
              </div>
            )}

            {/* ⭐ Rating — only shows if avgRating exists */}
            {avgRating !== undefined && (
              <div className="flex-1 py-3 px-4 border-r border-gray-100">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                  Rating
                </p>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-3.5 h-3.5 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <p className="text-[13px] font-semibold text-gray-800">
                    {avgRating.toFixed(1)}
                    <span className="text-gray-400 font-normal text-[11px] ml-1">
                      ({totalReviews ?? 0})
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="flex-1 py-3 px-4">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                Home services
              </p>
              <p className="text-[13px] font-semibold text-gray-800">
                {homeServiceCount ?? 0} listed
              </p>
            </div>
          </div>
        )}

        {/* view-beautician bottom CTA buttons */}
      {/* view-beautician bottom CTA buttons */}
        {!hideButtons && viewMode === "view-beautician" && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={rest.onMessage}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
            >
              Message
            </button>
            {viewerRole !=='beautician' && (
              <>
                <button
                  onClick={rest.onFollow}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                    isFollowing
                      ? "bg-rose-700 text-white border-rose-700 hover:bg-rose-800"
                      : "text-rose-700 border-rose-200 bg-rose-50 hover:bg-rose-100"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
                <button
                  onClick={rest.onBookService}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-all"
                  style={{ background: "#9b1c3a" }}
                >
                  Book service
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
   