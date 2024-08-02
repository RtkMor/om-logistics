"use client";

import React, { useEffect } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminFooter from "../components/AdminFooter";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

function AdminPage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user?.is_admin) {
      router.push("/");
    }
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-[90vh]">
      <AdminHeader />
      <AdminFooter />
    </div>
  );
}

export default AdminPage;
