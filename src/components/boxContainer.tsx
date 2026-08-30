import React from "react";
import { cn } from "@/lib/utils";

const boxContainer = ({
  icon,
  title,
  children,
  noContentPadding = false,
}: {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
  noContentPadding?: boolean;
}) => {
  return (
    <div className={cn("rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden", !noContentPadding && "p-4")}>
      <div className={cn("flex items-center gap-3", noContentPadding ? "p-4 border-b border-gray-100" : "mb-4")}>
        {icon && React.isValidElement(icon)
          ? React.cloneElement(icon as React.ReactElement<any>, {
              className: cn(
                (icon as React.ReactElement<any>).props.className,
                "h-5 w-5 text-purple-600"
              ),
            })
          : icon}
        <h2 className="text-lg font-bold tracking-tight text-gray-900">
          {title}
        </h2>
      </div>
      <div className={cn(!noContentPadding && "border-t border-gray-100 pt-4")}>{children}</div>
    </div>
  );
};

export default boxContainer;
