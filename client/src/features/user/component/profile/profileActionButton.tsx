//shows button according the roleee

import React, { useState } from 'react';
import { type ProfileActions } from './types';
import { type UserRoleType } from '../../../../constants/types/User';
import { Upload, Camera, Lightbulb, Home } from 'lucide-react';
type Tab = "upload" | "posts" | "tips" | "rent";

// Beautician Own Buttons - Horizontal layout below username
export const BeauticianOwnButtons: React.FC<
  ProfileActions & { isVerified?: boolean, role?: UserRoleType }
> = ({
  onEditProfile,
  onCalender,
  isVerified,
  role
}) => (
  <div className="flex items-center gap-3">
    <button
      onClick={onEditProfile}
      className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
    >
      Edit Profile
    </button>

    <button
      onClick={onCalender}
      className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium"
    >
      Calendar
    </button>
  </div>
);

export const BeauticianTabSection: React.FC<
  Pick<ProfileActions, 'onUpload' | 'onPosts' | 'onTips' | 'onRent'>
> = ({
  onUpload,
  onPosts,
  onTips,
  onRent
}) => {
   const [activeTab, setActiveTab] = useState<Tab>("posts");

  const handleClick = (tab: Tab, handler?: () => void) => {
    setActiveTab(tab);
    handler?.();
  };

  const activeClass = "text-gray-400 border-t-2 border-brown-500 -mt-[1px]";
  const inactiveClass = "text-gray-500 hover:text-gray-700";

  return (
    <div className="flex items-center justify-around border-t pt-4 mb-5">
  {onUpload && (
    <button
      onClick={() => handleClick("upload", onUpload)}
      className={`flex items-center gap-2 ${activeTab === "upload" ? activeClass : inactiveClass}`}
    >
      <Upload className="w-5 h-5" />
    </button>
  )}

  <button
    onClick={() => handleClick("posts", onPosts)}
    className={`flex items-center gap-2 ${activeTab === "posts" ? activeClass : inactiveClass}`}
  >
    <Camera className="w-5 h-5" />
    <span className="text-sm font-medium">POSTS</span>
  </button>

  <button
    onClick={() => handleClick("tips", onTips)}
    className={`flex items-center gap-2 ${activeTab === "tips" ? activeClass : inactiveClass}`}
  >
    <Lightbulb className="w-5 h-5" />
    <span className="text-sm font-medium">TIPS</span>
  </button>

  <button
    onClick={() => handleClick("rent", onRent)}
    className={`flex items-center gap-2 ${activeTab === "rent" ? activeClass : inactiveClass}`}
  >
    <Home className="w-5 h-5" />
    <span className="text-sm font-medium">RENT</span>
  </button>
</div>
  );
}
// Customer Own Button
export const CustomerOwnButtons: React.FC<ProfileActions> = ({ 
  onEditProfile,
  onRegisterAsBeautician 

}) => (
  <div>
   <button
      onClick={onEditProfile}
      className="px-6 py-2 mr-9 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
    >
      Edit Profile
    </button>
  <button 
    onClick={onRegisterAsBeautician} 
    className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
  >
    Register as Beautician
  </button>
  </div>
);

// View Beautician Buttons - Vertical stack on the right
export const ViewBeauticianButtons: React.FC<ProfileActions> = ({
  onServicePage,
  onCalender,
  onMessage,
  onFollow,
  onBookService
}) => (
  <div className="flex flex-col gap-3 min-w-[200px]">
    <button 
      onClick={onServicePage} 
      className="px-6 py-2.5 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium"
    >
      Service Page
    </button>
    <button 
      onClick={onCalender} 
      className="px-6 py-2.5 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium"
    >
      Calender
    </button>
    <button 
      onClick={onMessage} 
      className="px-6 py-2.5 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
    >
      Message
    </button>
    <button 
      onClick={onFollow} 
      className="px-6 py-2.5 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors font-medium"
    >
      Follow
    </button>
    <button 
      onClick={onBookService} 
      className="px-6 py-2.5 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors font-medium"
    >
      Book Home Service
    </button>
  </div>
);