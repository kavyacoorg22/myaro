
import { APP_LOGO } from "../constants/appConstants"


export const Header = () => {
  return (
    <div className="sticky top-0 left-0 right-0 flex items-center px-4 py-3 z-50 bg-white">
      <img src={APP_LOGO} alt="logo" width={50} height={50} />
      <h2 className="ml-2 text-3xl font-normal font-family-irish text-[#5C3D2E]">
        myaro
      </h2>
    </div>
  );
};