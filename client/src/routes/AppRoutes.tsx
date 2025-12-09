import { BrowserRouter, Route, Routes } from "react-router-dom"
import { publicRoutes } from "./PublicRoutes"
import { userRoutes } from "./UserRoutes"
import { adminRoutes } from "./adminRoute"


const AppRouters=()=>{


  return(
    <Routes>
      {publicRoutes.map((route)=>(
      <Route key={route.path} path={route.path} element={route.element}/>
      ))}
      
      {userRoutes.map((route)=>(
        <Route key={route.path} path={route.path} element={route.element}/>
      ))}

       {adminRoutes.map((route)=>(
        <Route key={route.path} path={route.path} element={route.element}/>
      ))}
     
     
    
    </Routes>
  )

}


 const AppRoute=()=>(
  <BrowserRouter>
   <AppRouters/>
  </BrowserRouter>
)

export default AppRoute


