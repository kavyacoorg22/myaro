import { HouseIcon,MagnifyingGlassIcon,PaperPlaneTiltIcon,UserIcon,
  SignInIcon,SignOutIcon,BellIcon,CameraRotateIcon,CalendarDotsIcon,UserListIcon } from "@phosphor-icons/react";
import { publicFrontendRoutes } from "../../constants/frontendRoutes/publicFrontendRoutes";
import { beauticianFrontendRoutes } from "../../constants/frontendRoutes/beauticianFrontendRoutes";
import { adminFrontendRoute } from "../../constants/frontendRoutes/adminFrontenRoutes";
import { SquarePlusIcon } from "lucide-react";
import { Wrench } from "lucide-react";
import { CreditCard, AlertTriangle, RotateCcw } from "lucide-react";




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
   {label:"Message",icon:PaperPlaneTiltIcon,path:publicFrontendRoutes.chat,showWhenAuthenticatedOnly:true,},
    {label:"Profile",icon:UserIcon, path:publicFrontendRoutes.profile,showWhenAuthenticatedOnly:true,},
     {label:"Notification",icon:BellIcon,path:publicFrontendRoutes.notification,showWhenAuthenticatedOnly:true,},
      {label:"Tips&Tricks",icon:CameraRotateIcon,path:publicFrontendRoutes.tipsRent,},
      {label:"Bookings",icon:CalendarDotsIcon,path:beauticianFrontendRoutes.booking,roles:['beautician']},
       {label:"Dashboard",icon:HouseIcon,path:adminFrontendRoute.dashboard,roles:['admin']},
  {label:"Users",icon:UserIcon,path:adminFrontendRoute.checkUser,roles:['admin']},
  {label:"Beautician",icon:UserListIcon,path:adminFrontendRoute.checkBeautician,roles:['admin']},
  {label:"Service",icon:SquarePlusIcon,path:adminFrontendRoute.services,roles:['admin']},
  {label:"Custom Services",icon:Wrench,path:adminFrontendRoute.customService,roles:['admin']},
      {label:"Refunds",icon:RotateCcw,path:adminFrontendRoute.refunds,roles:['admin']},
            {label:"Dispute",icon:AlertTriangle,path:adminFrontendRoute.dispute,roles:['admin']},
                  {label:"Payment",icon:CreditCard,path:adminFrontendRoute.booking,roles:['admin']},



    

]



export const logoutItem={label:"Logout",icon:SignOutIcon,variant:"danger",isButton:false}
export const loginItem={label:"Login",icon:SignInIcon,path:publicFrontendRoutes.login,variant:"primary"}


