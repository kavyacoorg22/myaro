import { useEffect, useRef, useState } from "react";
import { ProfileHeader } from "../component/profile/profilehead";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/appStore";
import { useNavigate, useParams } from "react-router-dom";
import { publicAPi } from "../../../services/api/public";
import { handleApiError } from "../../../lib/utils/handleApiError";
import type { IUserProfile } from "../../../types/dtos/user";
import { SaidBar } from "../component/saidBar/saidbar";
import { publicFrontendRoutes } from "../../../constants/frontendRoutes/publicFrontendRoutes";
import { customerFrontendRoutes } from "../../../constants/frontendRoutes/customerFrontendRoutes";
import { VerificationStatusBanner } from "../component/verificationStatus";
import {
  BeauticianStatus,
  type BeauticianStatusType,
} from "../../../constants/types/beautician";
import { BeauticianApi } from "../../../services/api/beautician";
import { ProfileTab } from "../component/profile/profileTab";
import { beauticianFrontendRoutes } from "../../../constants/frontendRoutes/beauticianFrontendRoutes";
import type { TimeSlot } from "../../types/schedule";
import type { IAddAvailabilityRequest } from "../../../types/api/beautician";
import { toast } from "react-toastify";
import { CalendarModal } from "../../beautician/component/calenderUI";
import { CreatePostModal } from "../../models/beautician/media/createPostModel";
import { CropModal } from "../../models/beautician/media/cropModal";
import { EditModal } from "../../models/beautician/media/editModal";
import { ShareModal } from "../../models/beautician/media/shareModal";
import type { MediaItemWithTrim } from "../../types/mediaType";
import PostsTab from "../../post/page/postTab";
import { ChatApi } from "../../../services/api/chat";

interface BeauticianInfo {
  isBeautician: boolean;
  verificationStatus?: BeauticianStatusType;
}

type ActiveTab = "posts" | "tips" | "rent";

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState<IUserProfile | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [beauticianInfo, setBeauticianInfo] = useState<BeauticianInfo>({
    isBeautician: false,
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>("posts");

  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [cropPreview, setCropPreview] = useState<string | null>(null);
  const [cropFileType, setCropFileType] = useState<"image" | "video" | null>(
    null,
  );
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState<{
    preview: string;
    fileType: "image" | "video";
    extras: { src: string; fileType: "image" | "video" }[];
  } | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [shareItems, setShareItems] = useState<MediaItemWithTrim[]>([]);
  const [customerSlots, setCustomerSlots] = useState<any[]>([]);

  const extrasRef = useRef<{ src: string; fileType: "image" | "video" }[]>([]);

  const currentUser = useSelector((store: RootState) => store.user.currentUser);

  const isOwnProfile = currentUser?.userId === profileData?.userId;
  const viewMode = isOwnProfile
    ? currentUser?.role === "beautician"
      ? "own-beautician"
      : "own-customer"
    : profileData?.role === "beautician"
      ? "view-beautician"
      : "view-customer";

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
            setProfileData(profile?.data?.data);
          } else {
            setError("Profile data structure is incorrect");
          }
        } else {
          const profile = await publicAPi.ownProfile();
          if (profile?.data?.data) {
            setProfileData(profile.data?.data);
          } else {
            setError("Profile data structure is incorrect");
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load profile";
        setError(errorMessage);
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id, currentUser]);

  const handleStartChat = async (participantB: string) => {
    try {
      const res = await ChatApi.createChat(participantB);

      const chat = res.data?.data;
      if (!chat || !profileData) return;

      navigate(`/chat/${chat.id}`, {
        state: {
          participant: {
            id: profileData.userId,
            fullName: profileData.fullName,
            userName: profileData.userName,
            profileImg: profileData.profileImg,
            role: profileData.role,
            serviceModes: profileData.beauticianData?.serviceModes ?? [],
          },
        },
      });
    } catch (err) {
      console.error("Failed to start chat", err);
    }
  };
  const fetchBeauticianStatus = async () => {
    try {
      const response = await BeauticianApi.getStatus();
      console.log("✅ Beautician status:", response.data?.data);
      setBeauticianInfo({
        isBeautician: true,
        verificationStatus: response.data?.data?.verificationStatus,
      });
    } catch (error: any) {
      console.log("❌ Not a beautician or error:", error);
      if (error.status === 404) {
        setBeauticianInfo({ isBeautician: false });
      }
    }
  };

  const handleSaveAvailability = async (
    request: IAddAvailabilityRequest,
  ): Promise<void> => {
    try {
      console.log("📤 Sending to API:", request);
      const response = await BeauticianApi.addAvailabilitySchedule(request);
      console.log("✅ Availability saved successfully:", response);
      toast.success("Availability saved successfully!");
    } catch (error) {
      console.error("❌ Error saving availability:", error);
      handleApiError(error);
      throw error;
    }
  };

  const handleDeleteSlot = async (slotToDelete: TimeSlot): Promise<void> => {
    try {
      console.log("🗑️ Deleting slot:", slotToDelete);
      const scheduleId = slotToDelete.scheduleId;

      if (!scheduleId) {
        console.error("No schedule ID in slot");
        toast.error("No schedule ID available");
        return;
      }

      const slotsToDelete = {
        startTime: slotToDelete.startTime,
        endTime: slotToDelete.endTime,
      };

      const response = await BeauticianApi.deleteAvailabilitySlot(
        slotsToDelete,
        scheduleId,
      );
      console.log("✅ Slot deleted successfully:", response);
      toast.success("Slot deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting slot:", error);
      handleApiError(error);
      toast.error("Failed to delete slot");
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
    if (viewMode === "own-customer" || viewMode === "view-customer") return;
    setIsCalendarOpen(true);
  };

  const handlePostFlowClose = () => {
    setShowShare(false);
    extrasRef.current = [];
    setShareItems([]);
    setEditData(null);
    setCropPreview(null);
    setCropFileType(null);
  };

  const handleCustomerDateSelect = async (
    dates: number[],
    currentDate?: Date,
  ) => {
    setSelectedDates(dates);
    if (
      viewMode !== "view-beautician" ||
      !profileData?.userId ||
      dates.length === 0
    )
      return;

    const ref = currentDate ?? new Date();
    const year = ref.getFullYear();
    const month = ref.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dates[0]).padStart(2, "0")}`;

    try {
      const res = await publicAPi.getAvailbilitySchedule(
        profileData.userId,
        dateStr,
      );
      setCustomerSlots(res.data?.data?.availability?.slots ?? []);
    } catch (err) {
      console.error("Failed to fetch slots", err);
      setCustomerSlots([]);
    }
  };

  // ─── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen">
        <SaidBar />
        <div className="ml-60 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
            <p className="text-sm text-gray-400">Loading profile…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <SaidBar />
        <div className="ml-60 flex-1 flex items-center justify-center p-6">
          <div className="bg-red-50 border border-red-200 p-6 rounded-2xl max-w-md w-full text-center">
            <p className="text-red-700 font-semibold mb-1">
              Couldn't load profile
            </p>
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex min-h-screen">
        <SaidBar />
        <div className="ml-60 flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Profile not found</p>
            <button
              onClick={() => navigate(publicFrontendRoutes.landing)}
              className="px-5 py-2 bg-gray-800 text-white rounded-full text-sm font-medium hover:bg-gray-900 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const shouldHideButtons =
    beauticianInfo.isBeautician &&
    (beauticianInfo.verificationStatus === BeauticianStatus.PENDING ||
      beauticianInfo.verificationStatus === BeauticianStatus.VERIFIED ||
      beauticianInfo.verificationStatus === BeauticianStatus.REJECTED);

  return (
    <>
      <SaidBar />
      <div className="min-h-screen bg-gray-50 ml-60 w-9.5/12">
        {/* ── Profile Header ── */}
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
          onRegisterAsBeautician={() =>
            navigate(customerFrontendRoutes.register)
          }
          onServicePage={() =>
            navigate(`/beautician/services`, {
              state: { beauticianId: profileData.userId },
            })
          }
          onMessage={() => handleStartChat(profileData.userId)}
          onFollow={() => console.log("Follow clicked")}
          onBookService={() => handleStartChat(profileData.userId)}
        />

        {/* ── Verification Banner ── */}
        {beauticianInfo.isBeautician && beauticianInfo.verificationStatus && (
          <div className="px-6 mt-4">
            <VerificationStatusBanner
              status={beauticianInfo.verificationStatus}
              onCompleteSetup={handleCompleteSetup}
              onResubmit={handleResubmit}
            />
          </div>
        )}

        {/* ── Tab Bar ── */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <ProfileTab
            viewMode={viewMode}
            isVerified={profileData.isVerified}
            onUpload={() => setShowUpload(true)}
            onPosts={() => setActiveTab("posts")}
            onTips={() => setActiveTab("tips")}
            onRent={() => setActiveTab("rent")}
          />
        </div>

        {/* ── Tab Content ── */}
        {(viewMode === "own-beautician" || viewMode === "view-beautician") && (
          <div className="bg-white min-h-[60vh]">
            {activeTab === "posts" && (
              <PostsTab
                beauticianUserId={isOwnProfile ? null : profileData.userId}
                viewMode={viewMode}
                postType="post"
                user={{userName:profileData.userName,fullName:profileData.fullName,profileImg:profileData.profileImg}}
              />
            )}

            {activeTab === "tips" && (
              <PostsTab
                beauticianUserId={isOwnProfile ? null : profileData.userId}
                viewMode={viewMode}
                postType="tips"
                user={{userName:profileData.userName,fullName:profileData.fullName,profileImg:profileData.profileImg}}

              />
            )}

            {activeTab === "rent" && (
              <PostsTab
                beauticianUserId={isOwnProfile ? null : profileData.userId}
                viewMode={viewMode}
                postType="rent"
              user={{userName:profileData.userName,fullName:profileData.fullName,profileImg:profileData.profileImg}}

              />
            )}
          </div>
        )}

        {/* ── Modals (unchanged) ── */}
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
            onDateSelect={handleCustomerDateSelect}
            existingSlots={customerSlots}
            onSaveSlots={handleSaveAvailability}
            onDeleteSlot={handleDeleteSlot}
            beauticianId={
              viewMode === "view-beautician" ? profileData.userId : undefined
            }
          />
        )}

        <CreatePostModal
          isOpen={showUpload}
          onClose={() => setShowUpload(false)}
          onNext={(preview, type) => {
            setCropPreview(preview);
            setCropFileType(type);
            setShowUpload(false);
            setShowCrop(true);
          }}
        />

        <CropModal
          isOpen={showCrop}
          preview={cropPreview}
          fileType={cropFileType}
          onBack={() => {
            setShowCrop(false);
            setShowUpload(true);
          }}
          onClose={() => setShowCrop(false)}
          onNext={(data) => {
            extrasRef.current = data.extras;
            setEditData(data);
            setShowCrop(false);
            setShowEdit(true);
          }}
        />

        <EditModal
          isOpen={showEdit}
          preview={editData?.preview ?? null}
          fileType={editData?.fileType ?? null}
          extras={extrasRef.current}
          onBack={() => {
            setShowEdit(false);
            setShowCrop(true);
          }}
          onClose={() => setShowEdit(false)}
          onNext={({ preview, fileType, allProcessed }) => {
            const items: MediaItemWithTrim[] = allProcessed
              ? allProcessed.map((item) => ({
                  src: item.src,
                  fileType: item.fileType,
                  trimStart: item.trimStart ?? 0,
                  trimEnd: item.trimEnd ?? 0,
                  soundOn: item.soundOn ?? true,
                }))
              : [
                  {
                    src: preview,
                    fileType,
                    trimStart: 0,
                    trimEnd: 0,
                    soundOn: true,
                  },
                  ...extrasRef.current.map((e) => ({
                    ...e,
                    trimStart: 0,
                    trimEnd: 0,
                    soundOn: true,
                  })),
                ];
            setShareItems(items);
            setShowEdit(false);
            setShowShare(true);
          }}
        />

        <ShareModal
          isOpen={showShare}
          mediaItems={shareItems}
          user={{
            userName: currentUser.userName ?? "",
            profileImg: currentUser.profileImg ?? undefined,
          }}
          onBack={() => {
            setShowShare(false);
            setShowEdit(true);
          }}
          onClose={handlePostFlowClose}
          onShare={async () => {}}
        />
      </div>
    </>
  );
};

export default ProfilePage;
