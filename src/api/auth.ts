const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const signup = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await fetch(`${api}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        is_admin: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    return await response.text();
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await fetch(`${api}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const responseData = await response.json();
    const { token } = responseData;
    localStorage.setItem("token", token);
    return { token };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
