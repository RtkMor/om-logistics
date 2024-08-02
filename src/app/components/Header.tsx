"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import profileIcon from "../../../public/user.png";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";

const Header = () => {
  const { user, setUser } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="h-[10vh] bg-red-400 shadow-md py-4 px-6 flex items-center justify-between">
      <div className="text-2xl font-bold">
        {user ? (
          <Link href="/" className="text-black">
            Logo
          </Link>
        ) : (
          <Link href="/login" className="text-black">
            Logo
          </Link>
        )}
      </div>
      <div className="flex-1 mx-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 focus:border-2 rounded-lg focus:outline-none focus:border-red-800"
        />
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <Link href="/profile">
              <Image
                src={profileIcon}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full"
              />
            </Link>
            {user.is_admin && (
              <Link href="/admin">
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                  Admin Panel
                </button>
              </Link>
            )}
            <Link href="/cart">
              <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Cart
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
