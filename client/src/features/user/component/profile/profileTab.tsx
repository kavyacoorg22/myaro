import { BeauticianTabSection } from "./profileActionButton";
import type { ProfileActions, ProfileData, ViewMode } from "./types";
 import React from "react";

interface Props extends ProfileData, ProfileActions {
  viewMode: ViewMode;
}

export const ProfileTab:React.FC<Props>=({
viewMode,
isVerified,
...rest
})=>{
return(
  <div>
     {isVerified && viewMode === "own-beautician" && (
            <BeauticianTabSection
              onUpload={rest.onUpload}
              onPosts={rest.onPosts}
              onTips={rest.onTips}
              onRent={rest.onRent}
            />
          )}
  </div>
)
}