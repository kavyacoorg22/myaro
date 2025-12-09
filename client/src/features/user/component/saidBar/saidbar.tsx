import { SaidBarItem } from "./saidBarItem"
import { loginItem, logoutItem, saidBarContent, type Role, type SidebarContentType } from "../../../../components/config/saidBarContent"
import logo from "../../../../assets/logo.png"
import {  useState } from "react";
import { cn } from "../../../../lib/utils/cn";
import  {useDispatch, useSelector} from 'react-redux'
import type { RootState } from "../../../../redux/appStore";
import { authApi } from "../../../../services/api/auth";
import { toast } from "react-toastify";
import { handleApiError } from "../../../../lib/utils/handleApiError";
import { logout } from "../../../../redux/userSlice/userSlice";
import {  useNavigate } from "react-router-dom";
import { publicFrontendRoutes } from "../../../../constants/frontendRoutes/publicFrontendRoutes";
import { ScrollArea } from "../../../../components/ui/scrollArea";
import { SearchModal } from "../../../models/user/Logic/searchLogic";

export const SaidBar=()=>{
    const [isExpanded, setIsExpanded] = useState(false);
       const [isSearchOpen, setIsSearchOpen] = useState(false);
    const currentUser=useSelector((store:RootState)=>store.user.currentUser)
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const role=currentUser?.role as Role |undefined

    
     const isAuthenticated = currentUser?.isAuthenticated ?? false;

     function cansee(content:SidebarContentType,isAuthenticated:boolean,role:Role|undefined)
     {
         if(content.showWhenAuthenticatedOnly && !isAuthenticated) return false

         if(content.roles && content.roles.length>0)
         {
          if(!role) return false
          return content.roles.includes(role)
         }

           if (role === "admin") return false;
      return true
     }

     const visibleItem=saidBarContent.filter((ele)=>cansee(ele,isAuthenticated,role))

  async function handleLogout(){
      try{
        const res=await authApi.logout()
        toast.success(res.data?.message)
          navigate(publicFrontendRoutes.landing,{replace:true})
      }catch(err)
      {
         handleApiError(err)
      }finally{
        dispatch(logout())
      

      }
   }

     function handleItemClick(content: SidebarContentType) {
     if (content.label === "Search") {
       setIsSearchOpen(true);
     }
   }
  return(
    <>
      <div 
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="w-fit fixed left-0 top-0 h-screen  z-50 transition-all duration-300"
    >
    <div className={`w-60 items-center h-screen  gap-4 pl-3 pt-3 ${
      currentUser.role==='admin' ? 'bg-[#2C5F6F] text-white' : 'bg-white text-gray-700'
    }`}>
      <div className="flex pb-5 mt-0">
       <img src={logo} alt="logo" width={50} height={50} />
     <h2 className={cn(
         "pt-1 text-3xl font-normal font-family-irish text-[#5C3D2E] transition-all duration-500",
         isExpanded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
       )}>myaro</h2>
      </div>
       
      <ScrollArea className="flex-1 pr-3">
            <nav className="space-y-1">
              {visibleItem.map((content)=>(
                <SaidBarItem 
                  key={content.label} 
                  label={content.label} 
                  icon={content.icon}  
                  path={content.path} 
                  isExpanded={isExpanded}
                  onClick={content.label === "Search" ? () => handleItemClick(content) : undefined} // ✅ Add onClick
                />
              ))}
            </nav>
          </ScrollArea>

      
      
      {!isAuthenticated ?(
        <SaidBarItem label={loginItem.label} icon={loginItem.icon} path={loginItem.path} isExpanded={isExpanded} variant={loginItem.variant as "primary"}/>
      ):(
        <SaidBarItem label={logoutItem.label} icon={logoutItem.icon} isExpanded={isExpanded} onClick={handleLogout} variant={logoutItem.variant as 'danger'}/>
        )
      
      
      }
    </div>
    </div>
    <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}