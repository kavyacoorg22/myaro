// 

import React from 'react';
import { type ProfileActions } from './types';
import { UserRole, type UserRoleType } from '../../../../constants/types/User';
import { Upload, Camera, Lightbulb, Home } from 'lucide-react';

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

// Tab Section (unchanged)
export const BeauticianTabSection: React.FC<
  Pick<ProfileActions, 'onUpload' | 'onPosts' | 'onTips' | 'onRent'>
> = ({
  onUpload,
  onPosts,
  onTips,
  onRent
}) => (
  <div className="flex items-center gap-40 border-t pt-4">
    <button
      onClick={onUpload}
      className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
    >
      <Upload className="w-5 h-5" />
    </button>

    <button
      onClick={onPosts}
      className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
    >
      <Camera className="w-5 h-5" />
      <span className="text-sm font-medium">POSTS</span>
    </button>

    <button
      onClick={onTips}
      className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
    >
      <Lightbulb className="w-5 h-5" />
      <span className="text-sm font-medium">TIPS</span>
    </button>

    <button
      onClick={onRent}
      className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
    >
      <Home className="w-5 h-5" />
      <span className="text-sm font-medium">RENT</span>
    </button>
  </div>
);

// Customer Own Button
export const CustomerOwnButtons: React.FC<ProfileActions> = ({ 
  onRegisterAsBeautician 
}) => (
  <button 
    onClick={onRegisterAsBeautician} 
    className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
  >
    Register as Beautician
  </button>
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