"use client";

const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../api/auth";
import { useUser } from "../../context/UserContext";

const LoginPage = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const { setUser } = useUser();
  const router = useRouter();

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await login(data);
      localStorage.setItem("token", response.token);

      // Fetch user details after login
      const userResponse = await fetch(`${api}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${response.token}`,
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
        setData({ email: "", password: "" });
        router.push("/");
      } else {
        setError("Failed to fetch user details after login.");
      }
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-slate-300">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={data.email}
              onChange={handleOnChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={data.password}
              onChange={handleOnChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-700">
            New user?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
