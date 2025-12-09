import { NavLink } from "react-router-dom";
import React from "react";
import { cn } from "../../../../lib/utils/cn";

type Props={
  label:string,
  icon:React.ComponentType<any>
  path?:string,
  onClick?:()=>void;
  variant?:"default"|"danger"|"primary",
  isExpanded:boolean
}

export function SaidBarItem({label,icon:Icon,path,onClick,variant='default',isExpanded}:Props){
const base="flex items-center gap-4 px-4 py-4 rounded-lg text-sm cursor-pointer group relative hover:bg-gray-100"
const variantType= variant === "danger" ? "text-red-500" : variant === "primary" ? "text-blue-600": "text-neutral-800";

const content=(isActive:boolean)=>(
  <div className={cn(base,variantType)}>
  <span className={cn("shrink-0 z-10", variantType)}>
    <Icon size={24} weight={isActive?"fill":"bold"} />
  </span>
  <span className={cn(
    "absolute left-14 whitespace-nowrap transition-all duration-500 ease-in-out font-medium",
    isExpanded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4  pointer-events-none"
  )}>{label}</span>
  </div>
)

 if(onClick)
  {
    return <button onClick={onClick} className="w-full text-left">{content(false)}</button>
  }

  
  if(path)
  {
    return <NavLink to={path} className={({isActive})=>isActive?"bg-orange-300 rounded-lg":""}>{({isActive})=>content(isActive)}</NavLink>
  }

  return <div className="w-full">{content(false)}</div>
}