import { NavLink } from "react-router-dom";
import React from "react";
import { cn } from "../../../../lib/utils/cn";

type Props = {
  label: string,
  icon: React.ComponentType<any>
  path?: string,
  onClick?: () => void;
  variant?: "default" | "danger" | "primary",
  isExpanded: boolean
}

export function SaidBarItem({ label, icon: Icon, path, onClick, variant = 'default', isExpanded }: Props) {
  const base = "flex items-center gap-4 px-3 py-3 rounded-lg text-sm cursor-pointer hover:bg-gray-100 transition-colors"
  const variantType = variant === "danger" ? "text-red-500" : variant === "primary" ? "text-blue-600" : "text-neutral-800";

  const content = (isActive: boolean) => (
    <div className={cn(base, variantType, isActive && "bg-gray-200")}>
      <span className="shrink-0">
        <Icon size={24} weight={isActive ? "fill" : "bold"} />
      </span>
      <span className={cn(
        "whitespace-nowrap font-medium transition-all duration-300 overflow-hidden",
        isExpanded ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
      )}>
        {label}
      </span>
    </div>
  )

  if (onClick) {
    return <button onClick={onClick} className="w-full text-left">{content(false)}</button>
  }

  if (path) {
    return (
      <NavLink to={path}>
        {({ isActive }) => content(isActive)}
      </NavLink>
    )
  }

  return <div className="w-full">{content(false)}</div>
}