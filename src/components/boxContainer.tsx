import React from "react";
import { cn } from "@/lib/utils";

const boxContainer = ({
  icon,
  title,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
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
      <div className="border-t border-gray-100 pt-4">{children}</div>
    </div>
  );
};

export default boxContainer;
