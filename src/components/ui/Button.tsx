"use client";
import clsx from "clsx";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "default";
};
export function Button({ variant = "default", className, ...props }: Props) {
  return (
    <button
      {...props}
      className={clsx("btn", variant === "primary" && "btn-primary", className)}
    />
  );
}
