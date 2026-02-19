import { useEffect, useState } from 'react';
import { ProfileHeader } from '../component/profile/profilehead';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../redux/appStore';
import { useNavigate, useParams } from 'react-router-dom';
import { publicAPi } from '../../../services/api/public';
import { handleApiError } from '../../../lib/utils/handleApiError';
import type { IUserProfile } from '../../../types/dtos/user';
import { SaidBar } from '../component/saidBar/saidbar';
import { publicFrontendRoutes } from '../../../constants/frontendRoutes/publicFrontendRoutes';
import { customerFrontendRoutes } from '../../../constants/frontendRoutes/customerFrontendRoutes';
import { VerificationStatusBanner } from '../component/verificationStatus';
import { BeauticianStatus, type BeauticianStatusType } from '../../../constants/types/beautician';
import { BeauticianApi } from '../../../services/api/beautician';
import { ProfileTab } from '../component/profile/profileTab';
import { beauticianFrontendRoutes } from '../../../constants/frontendRoutes/beauticianFrontendRoutes';
import type { TimeSlot } from '../../types/schedule';
import type { IAddAvailabilityRequest } from '../../../types/api/beautician';
import { toast } from 'react-toastify';
import { CalendarModal } from '../../beautician/component/calenderUI';

interface BeauticianInfo {
  isBeautician: boolean;
  verificationStatus?: BeauticianStatusType;
}

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState<IUserProfile | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [beauticianInfo, setBeauticianInfo] = useState<BeauticianInfo>({
    isBeautician: false
  });
  
  // Simplified state - only what's needed
  const [selectedDates, setSelectedDates] = useState<number[]>([]);

  const currentUser = useSelector((store: RootState) => store.user.currentUser);

  // Determine viewMode early so it can be used in functions
  const isOwnProfile = currentUser?.userId === profileData?.userId;
  const viewMode = isOwnProfile 
    ? (currentUser?.role === 'beautician' ? 'own-beautician' : 'own-customer')
    : (profileData?.role === 'beautician' ? 'view-beautician' : 'view-customer');

  useEffect(() => {
    const loadProfile = async () => {
      if (!id && currentUser) {
        fetchBeauticianStatus();
      }
      try {
        setLoading(true);
        setError(null);

        if (id) {
          console.log(`use param id in frontend ${id}`);
          const profile = await publicAPi.callById(id);
          if (profile?.data?.data) {
            setProfileData(profile.data?.data);
          } else {
            setError('Profile data structure is incorrect');
          }
        } else {
          const profile = await publicAPi.ownProfile();
          if (profile?.data?.data) {
            setProfileData(profile.data.data);
          } else {
            setError('Profile data structure is incorrect');
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
        setError(errorMessage);
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id, currentUser]);

  const fetchBeauticianStatus = async () => {
    try {
      const response = await BeauticianApi.getStatus();
      console.log('✅ Beautician status:', response.data?.data);
      
      setBeauticianInfo({
        isBeautician: true,
        verificationStatus: response.data?.data?.verificationStatus 
      });
    } catch (error: any) {
      console.log('❌ Not a beautician or error:', error);
      if (error.status === 404) {
        setBeauticianInfo({ isBeautician: false });
      }
    }
  };

  // Save availability - simplified (no loading state needed, handled in modal)
  const handleSaveAvailability = async (request: IAddAvailabilityRequest): Promise<void> => {
    try {
      console.log('📤 Sending to API:', request);
      
      const response = await BeauticianApi.addAvailabilitySchedule(request);
      
      console.log('✅ Availability saved successfully:', response);
      
      toast.success('Availability saved successfully!');
    } catch (error) {
      console.error('❌ Error saving availability:', error);
      handleApiError(error);
      throw error;
    }
  };

  // Delete specific slot - simplified
  const handleDeleteSlot = async (slotToDelete: TimeSlot): Promise<void> => {
    try {
      console.log('🗑️ Deleting slot:', slotToDelete);
      
      // Extract scheduleId from the slot
      const scheduleId = slotToDelete.scheduleId;
      
      if (!scheduleId) {
        console.error('No schedule ID in slot');
        toast.error('No schedule ID available');
        return;
      }

      // Convert TimeSlot to Slot format (remove scheduleId)
      const slotsToDelete = {
        startTime: slotToDelete.startTime,
        endTime: slotToDelete.endTime
      };

      const response = await BeauticianApi.deleteAvailabilitySlot(
        slotsToDelete,
        scheduleId
      );
      
      console.log('✅ Slot deleted successfully:', response);
      
      toast.success('Slot deleted successfully!');
    } catch (error) {
      console.error('❌ Error deleting slot:', error);
      handleApiError(error);
      toast.error('Failed to delete slot');
      throw error;
    }
  };

  const handleCompleteSetup = () => {
    navigate(customerFrontendRoutes.register, { state: { startAtStep: 3 } });
  };

  const handleResubmit = () => {
    navigate(customerFrontendRoutes.register);
  };

  const handleCalendarClick = () => {
    if (viewMode === 'own-customer' || viewMode === 'view-customer') return;
    setIsCalendarOpen(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
          <p className="text-red-800 font-semibold">Error loading profile</p>
          <p className="text-red-600 mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p>Profile not found</p>
          <button 
            onClick={() => navigate(publicFrontendRoutes.landing)} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const shouldHideButtons = beauticianInfo.isBeautician && 
    (beauticianInfo.verificationStatus === BeauticianStatus.PENDING || 
     beauticianInfo.verificationStatus === BeauticianStatus.VERIFIED ||
     beauticianInfo.verificationStatus === BeauticianStatus.REJECTED);
  
  return (
    <>
      <SaidBar />
      <div className="min-h-screen bg-white ml-60 w-9.5/12">
        <ProfileHeader
          viewMode={viewMode}
          userName={profileData.userName}
          fullName={profileData.fullName}
          profileImg={profileData.profileImg}
          about={profileData.beauticianData?.about}
          shopName={profileData.beauticianData?.shopName}
          yearsOfExperience={profileData.beauticianData?.yearsOfExperience}
          shopAddress={profileData.beauticianData?.shopAddress?.address}
          shopCity={profileData.beauticianData?.shopAddress?.city}
          homeServiceCount={profileData.beauticianData?.homeservicecount}
          isVerified={profileData.isVerified}
          hideButtons={shouldHideButtons}
          onEditProfile={() => navigate(beauticianFrontendRoutes.editProfile)}
          onCalender={handleCalendarClick}
          onRegisterAsBeautician={() => navigate(customerFrontendRoutes.register)}
          onServicePage={() => navigate(`/beautician/services`,{state: { beauticianId: profileData.userId }})}
          onMessage={() => navigate(`/messages/${profileData.userId}`)}
          onFollow={() => console.log('Follow clicked')}
          onBookService={() => navigate(`/book/${profileData.userId}`)}
        />

        {beauticianInfo.isBeautician && beauticianInfo.verificationStatus && (
          <div className="px-6 mt-6">
            <VerificationStatusBanner
              status={beauticianInfo.verificationStatus}
              onCompleteSetup={handleCompleteSetup}
              onResubmit={handleResubmit}
            />
          </div>
        )}

        <div className="mt-0">
          <ProfileTab
            viewMode={viewMode}
            isVerified={profileData.isVerified}
            onUpload={() => navigate(`/beautician/${profileData.userId}/upload`)}
            onPosts={() => navigate(`/profile/${profileData.userId}/posts`)}
            onTips={() => navigate(`/profile/${profileData.userId}/tips`)}
            onRent={() => navigate(`/profile/${profileData.userId}/rent`)}
          />
        </div>

        {/* Calendar Modal */}
        {isCalendarOpen && (
          <CalendarModal
            isOpen={isCalendarOpen}
            onClose={() => {
              setIsCalendarOpen(false);
              setSelectedDates([]);
            }}
            viewMode={viewMode}
            profileName={profileData.userName}
            profileUsername={profileData.fullName}
            profileImage={profileData.profileImg}
            initialDate={new Date()}
            initialSelectedDates={selectedDates}
            onDateSelect={setSelectedDates}
            existingSlots={[]} 
            onSaveSlots={handleSaveAvailability}
            onDeleteSlot={handleDeleteSlot}
            beauticianId={viewMode === 'view-beautician' ? profileData.userId : undefined}
          />
        )}
      </div>
    </>
  );
};

export default ProfilePage