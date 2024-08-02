"use client";

import React, { useEffect, useState } from "react";
import CartProduct from "../components/CartProduct";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";

interface CartItem {
  product_id: string;
  quantity: number;
}

const CartPage = () => {
  const [cartDetails, setCartDetails] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { user } = useUser();

  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/fetch-cart`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: user?.email }),
          }
        );

        const data = await response.json();

        if (data.success) {
          setCartDetails(data.cart?.products);
        } else {
          throw new Error("Failed to fetch cart details!");
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    fetchCartDetails();
  }, [user?.email]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] gap-5">
      <h1 className="text-2xl">Cart</h1>
      {cartDetails.length > 0 ? (
        cartDetails.map((item, ind) => (
          <CartProduct
            key={ind}
            product_id={item.product_id}
            quantity={item.quantity}
            setTotalPrice={setTotalPrice}
          />
        ))
      ) : (
        <p>No items in cart</p>
      )}
      <h1 className="text-2xl">Total Price: {totalPrice / 2}</h1>
    </div>
  );
};

export default CartPage;
