"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface CartProductProps {
  product_id: string;
  quantity: number;
  setTotalPrice: (callback: (prevTotal: number) => number) => void;
}

const CartProduct: React.FC<CartProductProps> = ({
  product_id,
  quantity,
  setTotalPrice,
}) => {
  const [productDetails, setProductDetails] = useState<{
    productName: string;
    sellingPrice: number;
  }>({
    productName: "",
    sellingPrice: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/get-product`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ product_id }),
          }
        );

        const dataResponse = await response.json();

        if (dataResponse._id) {
          const product = dataResponse;
          setProductDetails({
            productName: product.title,
            sellingPrice: product.price,
          });

          setTotalPrice((prev) => prev + quantity * product.price);
        } else {
          throw new Error("Failed to fetch the product!");
        }
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [product_id, quantity, setTotalPrice]);

  const handleRemoveClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmRemove = () => {
    setShowConfirmation(false);
    setTotalPrice(
      (prevTotal) => prevTotal - quantity * productDetails.sellingPrice
    );
  };

  const handleCancelRemove = () => {
    setShowConfirmation(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center w-full p-6 bg-white shadow-lg rounded-lg">
      <div className="flex-grow">
        <h2 className="text-xl text-gray-900 font-bold overflow-hidden overflow-ellipsis whitespace-normal md:whitespace-nowrap md:overflow-clip line-clamp-2">
          {productDetails.productName}
        </h2>
        <p className="text-lg text-gray-700 mt-2">
          Rs.{productDetails.sellingPrice}
        </p>
      </div>
      <div className="flex items-center mt-4 sm:mt-0 sm:ml-4">
        <button className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
          -
        </button>
        <p className="mx-4 text-lg text-gray-900">{quantity}</p>
        <button className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
          +
        </button>
      </div>
      <button
        onClick={handleRemoveClick}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mt-4 sm:mt-0 sm:ml-4"
      >
        Remove
      </button>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Confirm Removal</h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to remove this item from your cart?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelRemove}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartProduct;
