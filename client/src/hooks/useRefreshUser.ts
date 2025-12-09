import { useDispatch } from "react-redux";
import { authApi } from "../services/api/auth";
import { setCurrentUser } from "../redux/userSlice/userSlice";
import { handleApiError } from "../lib/utils/handleApiError";


export const useRefreshUser = () => {
  const dispatch = useDispatch();

  const refreshUserData = async () => {
    try {
      const response = await authApi.refershToken();
      
      if (response.data?.user) {
        
        dispatch(setCurrentUser({
          userId: response.data.user.id,
          role: response.data.user.role,
          userName: response.data.user.userName,
          fullName: response.data.user.fullName,
          profileImg: response.data.user.profileImg,
        }));
        return response.data.user;
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  return { refreshUserData };
};