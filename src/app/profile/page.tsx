"use client";

import React, { useState } from "react";
import { useUser } from "../../context/UserContext";

const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const Profile = () => {
  const { user, setUser } = useUser();
  const [name, setName] = useState(user?.name || "");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${api}/update-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user?.email, name }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      setIsEditing(false);

      setUser((prev) => {
        if (prev) {
          return { ...prev, name };
        }
        return prev;
      });

      setError(null);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <section id="profile">
      <div className="mx-auto container p-4 min-h-[90vh]">
        <div className="p-4 w-full max-w-2xl mx-auto rounded flex flex-col gap-4">
          <div className="bg-slate-200 flex-col p-4 rounded-xl">
            <h2 className="text-center font-bold">Profile</h2>
            <div className="flex flex-col p-2 gap-2">
              <div className="grid">
                <label htmlFor="name">Name: </label>
                <div className="bg-slate-100 p-2 rounded-full">
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleNameChange}
                    readOnly={!isEditing}
                    className="w-full h-full outline-none bg-transparent"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="text-center">
                  Email:{" "}
                </label>
                <div className="bg-slate-100 p-2 rounded-full">
                  <input
                    type="email"
                    name="email"
                    value={user?.email || ""}
                    readOnly
                    className="w-full h-full outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {isEditing ? (
            <div className="flex gap-4">
              <button
                onClick={handleUpdate}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Edit Name
            </button>
          )}
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
            Generate Report
          </button>
        </div>
      </div>
    </section>
  );
};

export default Profile;
