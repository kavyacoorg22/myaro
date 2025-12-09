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
import { UserRole } from '../../../constants/types/User';
import { ProfileTab } from '../component/profile/profileTab';
import { beauticianFrontendRoutes } from '../../../constants/frontendRoutes/beauticianFrontendRoutes';

interface BeauticianInfo {
  isBeautician: boolean;
  verificationStatus?: BeauticianStatusType;
}

export const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState<IUserProfile | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [beauticianInfo, setBeauticianInfo] = useState<BeauticianInfo>({
    isBeautician: false
  });

  const currentUser = useSelector((store: RootState) => store.user.currentUser);

  useEffect(() => {
    const loadProfile = async () => {
       if(!id && currentUser)
    {
      fetchBeauticianStatus();
    }
      try {
        setLoading(true);
        setError(null);

        if (id) {
          console.log(`use param id in fromtend ${id}`)
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
  }, [id,currentUser]);

 
  

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

  const handleCompleteSetup = () => {
    navigate(customerFrontendRoutes.register, { state: { startAtStep: 3 } });
  };

  const handleResubmit = () => {
    navigate(customerFrontendRoutes.register);
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

  const isOwnProfile = currentUser?.userId === profileData?.userId;
  const viewMode = isOwnProfile 
    ? (currentUser.role === 'beautician' ? 'own-beautician' : 'own-customer')
    : (profileData?.role === 'beautician' ? 'view-beautician' : 'view-customer');

  const shouldHideButtons = beauticianInfo.isBeautician && 
    (beauticianInfo.verificationStatus === BeauticianStatus.PENDING || 
     beauticianInfo.verificationStatus === BeauticianStatus.VERIFIED ||
     beauticianInfo.verificationStatus === BeauticianStatus.REJECTED);
  
  return (
    <>
      <SaidBar />
      <div className="min-h-screen bg-white ml-60 w-9.5/12">
        {/* Profile Header */}
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
          
          isVerified={profileData.isVerified }
        
          
          hideButtons={shouldHideButtons}
          onEditProfile={() => navigate(beauticianFrontendRoutes.editProfile)}
          onCalender={() => navigate('/calendar')}
          onRegisterAsBeautician={() => navigate(customerFrontendRoutes.register)}
          onServicePage={() => navigate(`/beautician/${profileData.userId}/services`)}
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
          isVerified={profileData.isVerified }
         onUpload={() => navigate(`/beautician/${profileData.userId}/upload`)}
          onPosts={() => navigate(`/profile/${profileData.userId}/posts`)}
          onTips={() => navigate(`/profile/${profileData.userId}/tips`)}
          onRent={() => navigate(`/profile/${profileData.userId}/rent`)}
         />

        </div>
      </div>
    </>
  );
};