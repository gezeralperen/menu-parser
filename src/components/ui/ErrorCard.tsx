import React from "react";

export function ErrorCard({
  title = "Something went wrong",
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <div className="card error-card" role="alert">
      <strong className="body bold">{title}</strong>
      <p className="body">{message}</p>
    </div>
  );
}
