import { HouseIcon,MagnifyingGlassIcon,PaperPlaneTiltIcon,UserIcon,
  SignInIcon,SignOutIcon,BellIcon,CameraRotateIcon,CalendarDotsIcon,UserListIcon } from "@phosphor-icons/react";
import { publicFrontendRoutes } from "../../constants/frontendRoutes/publicFrontendRoutes";
import { beauticianFrontendRoutes } from "../../constants/frontendRoutes/beauticianFrontendRoutes";
import { adminFrontendRoute } from "../../constants/frontendRoutes/adminFrontenRoutes";


export type Role="customer"|"beautician"|"admin"

export type SidebarContentType = {
  label: string;
  path?: string;
  icon: React.ComponentType<{ size?: number}>;
  roles?: Role[];
  showWhenAuthenticatedOnly?: boolean;
  variant?:string
  isButton?:boolean
};

export const saidBarContent:SidebarContentType[]=[
  {label:"Home",icon:HouseIcon,path:publicFrontendRoutes.landing,},
  {label:"Search",icon:MagnifyingGlassIcon,showWhenAuthenticatedOnly:true,isButton:true},
   {label:"Message",icon:PaperPlaneTiltIcon,path:publicFrontendRoutes.message,showWhenAuthenticatedOnly:true,},
    {label:"Profile",icon:UserIcon, path:publicFrontendRoutes.profile,showWhenAuthenticatedOnly:true,},
     {label:"Notification",icon:BellIcon,path:publicFrontendRoutes.notification,showWhenAuthenticatedOnly:true,},
      {label:"Tips&Tricks",icon:CameraRotateIcon,path:publicFrontendRoutes.tipsRent,},
      {label:"Bookings",icon:CalendarDotsIcon,path:beauticianFrontendRoutes.booking,roles:['beautician']},
       {label:"Dashboard",icon:HouseIcon,path:adminFrontendRoute.dashboard,roles:['admin']},
  {label:"Users",icon:UserIcon,path:adminFrontendRoute.checkUser,roles:['admin']},
  {label:"Beautician",icon:UserListIcon,path:adminFrontendRoute.checkBeautician,roles:['admin']}
  
    
    

]



export const logoutItem={label:"Logout",icon:SignOutIcon,variant:"danger",isButton:false}
export const loginItem={label:"Login",icon:SignInIcon,path:publicFrontendRoutes.login,variant:"primary"}


