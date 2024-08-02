"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signup } from "../../api/auth";

const SignUpPage: React.FC = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signup(data);
      setData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      router.push("/login");
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-slate-300">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={data.name}
              onChange={handleOnChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
              required
            />
          </div>
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
          <div className="mb-6">
            <label
              className="block text-gray-700 mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={data.confirmPassword}
              onChange={handleOnChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-700">
            Already a user?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
