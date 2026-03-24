import React from "react";
import { Navigate } from "react-router-dom";
import { useNgekostAuth } from "@/lib/NgekostAuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useNgekostAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
