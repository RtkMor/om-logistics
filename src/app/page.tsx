"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

type ProductType = {
  _id: { $oid: string }; // Use 'string' for MongoDB ObjectId
  title: string;
  description: string;
  price: number;
  img: string;
  quantity: number;
};

const Home = () => {
  const { user } = useUser();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<{ product_id: string; quantity: number }[]>(
    []
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data: ProductType[] = await response.json();
        setProducts(data);
      } catch (error: any) {
        setError(error?.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  function handleAddToCart(product_id: string) {
    // Define the quantity to add to the cart. This can be dynamic based on user input.
    const quantityToAdd = 1; // Example: Always adding 1 item for simplicity.

    // Prepare the cart item
    const cartItem = {
      product_id,
      quantity: quantityToAdd,
    };

    // Send a request to add the item to the cart
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user?.email,
        products: [cartItem],
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add item to cart");
        }
        return response.json();
      })
      .then((data) => {
        // Update the cart state if needed
        setCart((prevCart) => [...prevCart, cartItem]);
        alert("Product added to cart successfully!");
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  return (
    <div>
      <main className="flex min-h-[90vh] min-w-[100vw] flex-col items-center justify-between p-24">
        {user ? (
          <div className="min-w-[50%]">
            <h1>Welcome back, {user.name}!</h1>
            <div className="p-6 bg-gray-100">
              <h1 className="text-3xl font-bold mb-8 text-center">
                Product Catalog
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <div
                    key={product._id.$oid}
                    className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 border border-gray-200 hover:border-gray-400 mb-8"
                  >
                    <h2 className="text-2xl font-semibold mb-4">
                      {product.title}
                    </h2>
                    <p className="text-gray-700 mb-4">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-900 font-bold text-lg">
                        ${product.price}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">
                        In Stock: {product.quantity}
                      </p>
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                        onClick={() => handleAddToCart(product._id.$oid)}
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <h1>Welcome to our site!</h1>
        )}
      </main>
    </div>
  );
};

export default Home;
