import { BeauticianTabSection } from "./profileActionButton";
import type { ProfileActions, ProfileData, ViewMode } from "./types";
 import React from "react";

interface Props extends ProfileData, ProfileActions {
  viewMode: ViewMode;
}

export const ProfileTab: React.FC<Props> = ({ viewMode, isVerified, ...rest }) => {
  const isOwnProfile = isVerified && viewMode === "own-beautician";
  const isViewingProfile = viewMode === "view-beautician";

  if (!isOwnProfile && !isViewingProfile) return null;

  return (
    <div>
      <BeauticianTabSection
        onPosts={rest.onPosts}
        onTips={rest.onTips}
        onRent={rest.onRent}
        onUpload={isOwnProfile ? rest.onUpload : undefined}
      />
    </div>
  );
};