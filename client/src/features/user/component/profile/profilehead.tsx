// import React from 'react';
// import type { ViewMode, ProfileData, ProfileActions } from './types';
// import { 
//   BeauticianOwnButtons, 
//   CustomerOwnButtons, 
//   ViewBeauticianButtons,
//    BeauticianTabSection
// } from './profileActionButton';

// interface Props extends ProfileData, ProfileActions {
//   viewMode: ViewMode;
// }

// export const ProfileHeader: React.FC<Props> = ({
//   viewMode,
//   userName,
//   fullName,
//   profileImg,
//   hideButtons = false,
//   yearsOfExperience,
//   shopName,
//   shopAddress,
//   shopCity,
//   homeServiceCount,
//   isVerified,
//   role,
//   ...rest
// }) => {
  
//   return (
//     <div className="bg-white p-8 rounded-lg shadow-sm ">
//       <div className="flex items-start gap-8">
//         {/* Profile Image */}
//         <div className="shrink-0">
//           <div className="w-28 h-28 rounded-full overflow-hidden bg-teal-400">
//             {profileImg ? (
//               <img src={profileImg} alt={userName} className="w-full h-full object-cover" />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center text-white text-4xl font-semibold">
//                 {userName?.charAt(0).toUpperCase()}
//               </div>
//             )}
//           </div>
//         </div>

        
//         <div className="flex-1">
         
//           <div className="flex items-start justify-between mb-4">
//             <div>
//               <h1 className="text-2xl font-semibold text-gray-900">{userName}</h1>
//               {fullName && <p className="text-gray-700 font-medium mt-2">{fullName}</p>}
//             </div>

//             {!hideButtons && (
//               <div className="flex items-center gap-4">
//                 {viewMode === "own-beautician" && (
//                   <BeauticianOwnButtons 
//                     {...rest} 
//                     isVerified={isVerified}
//                     role={role}
//                   />
//                 )}
//                 {viewMode === "own-customer" && <CustomerOwnButtons {...rest} />}
//                 {viewMode === "view-beautician" && <ViewBeauticianButtons {...rest} />}
//               </div>
//             )}
//           </div>
       
//           {isVerified && rest.about&& (
//             <p className="text-gray-700 mb-4 max-w-2xl">{rest.about}</p>
//           )}
//          {isVerified && (
//           <div className="flex flex-wrap gap-8 items-center">
           
//             <div className="min-w-[220px]">
//               {shopName && <p className="text-base font-medium text-gray-900">{shopName}</p>}

//               {shopAddress && (
//                 <p className="text-sm text-gray-600 mt-1">
//                   {shopAddress}
//                   {shopCity ? `, ${shopCity}` : ""}
//                 </p>
//               )}
//             </div>

          
//             <div className="min-w-[160px]">
//               <p className="text-sm text-gray-500">Experience</p>
//               <p className="text-base font-medium text-gray-900">
//                 {yearsOfExperience !== undefined ? `${yearsOfExperience} yrs` : "—"}
//               </p>
//             </div>

            
//             <div className="min-w-[160px] text-center">
//               <p className="text-sm text-gray-500">Home Service</p>
//               <p className="text-base font-medium text-pink-600">
//                 {homeServiceCount ?? 0}
//               </p>
//             </div>
//           </div>)}

          
//         </div>
//       </div>
       
//     </div>
//   );
// };



import React from 'react';
import type { ViewMode, ProfileData, ProfileActions } from './types';
import { 
  BeauticianOwnButtons, 
  CustomerOwnButtons, 
  ViewBeauticianButtons,
  BeauticianTabSection
} from './profileActionButton';

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
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <div className="flex items-start gap-8">
        {/* Profile Image */}
        <div className="shrink-0">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-teal-400">
            {profileImg ? (
              <img src={profileImg} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-4xl font-semibold">
                {userName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Profile Info - Takes remaining space */}
        <div className="flex-1">
          {/* Username, Full Name, and Buttons Row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{userName}</h1>
              {fullName && <p className="text-gray-700 font-medium mt-2">{fullName}</p>}
            </div>

            {/* Action Buttons for own-beautician and own-customer - Next to username */}
            {!hideButtons && (viewMode === "own-beautician" || viewMode === "own-customer") && (
              <div>
                {viewMode === "own-beautician" && (
                  <BeauticianOwnButtons 
                    {...rest} 
                    isVerified={isVerified}
                    role={role}
                  />
                )}
                {viewMode === "own-customer" && <CustomerOwnButtons {...rest} />}
              </div>
            )}
          </div>
       
          {/* About Section */}
          {isVerified && rest.about && (
            <p className="text-gray-700 mb-4 max-w-2xl">{rest.about}</p>
          )}
         
          {/* Shop Info and Stats */}
          {isVerified && (
            <div className="space-y-4">
              {/* Shop Name and Address */}
              <div>
                {shopName && <p className="text-base font-medium text-gray-900">{shopName}</p>}
                {shopAddress && (
                  <p className="text-sm text-gray-600 mt-1">
                    {shopAddress}
                    {shopCity ? `, ${shopCity}` : ""}
                  </p>
                )}
              </div>

              {/* Experience and Home Service - Horizontal */}
              <div className="flex justify-between items-center-safe gap-1">
                {/* Experience */}
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="text-base font-medium text-gray-900 mt-1">
                    {yearsOfExperience !== undefined ? `${yearsOfExperience} yrs` : "—"}
                  </p>
                </div>

                {/* Home Service Count */}
                <div>
                  <p className="text-sm text-gray-500">Home Service</p>
                  <p className="text-base font-medium text-pink-600 mt-1">
                    {homeServiceCount ?? 0}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons for view-beautician - Service Page and Calendar on the right */}
         {!hideButtons && viewMode === "view-beautician" && (
          <div className="shrink-0 self-start flex gap-3">
            <button 
              onClick={rest.onServicePage}
              className="px-6 py-2.5 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium whitespace-nowrap"
            >
              Service Page
            </button>
            <button 
              onClick={rest.onCalender}
              className="px-6 py-2.5 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium"
            >
              Calendar
            </button>
          </div>
        )}
      </div>

     
      {!hideButtons && viewMode === "view-beautician" && (
        <div className="flex items-center gap-3 mt-6">
          <button 
            onClick={rest.onMessage}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Message
          </button>
          <button 
            onClick={rest.onFollow}
            className="px-6 py-2 bg-amber-800/70 text-white rounded-lg hover:bg-amber-800/80 transition-colors font-medium"
          >
            Follow
          </button>
          <button 
            onClick={rest.onBookService}
            className="px-6 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-800/90 transition-colors font-medium"
          >
            Book home service
          </button>
        </div>
      )}
    </div>
  );
};