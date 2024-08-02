"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <button
          className="absolute top-4 right-4 text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

type ProductType = {
  _id: { $oid: string };
  title: string;
  description: string;
  price: number;
  img: string;
  quantity: number;
};

function AdminProduct() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );

  useEffect(() => {
    const fetchProducts = () => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch products");
          }
          return response.json();
        })
        .then((data) => {
          setProducts(data);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setIsLoading(false);
        });
    };
    fetchProducts();
  }, []);

  const handleUpdateClick = (product: ProductType) => {
    setSelectedProduct(product);
  };

  const handleDelete = (id: string) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete product");
        }
        setProducts(products.filter((product) => product._id.$oid !== id));
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleUpdateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProduct) return;

    const updatedProduct = {
      ...selectedProduct,
      price: parseInt(selectedProduct.price as unknown as string, 10),
      quantity: parseInt(selectedProduct.quantity as unknown as string, 10),
    };

    console.log(updatedProduct);

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${selectedProduct._id.$oid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update product");
        }
        setProducts(
          products.map((product) =>
            product._id.$oid === selectedProduct._id.$oid
              ? updatedProduct
              : product
          )
        );
        setSelectedProduct(null);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!selectedProduct) return;

    const { name, value } = event.target;
    setSelectedProduct({ ...selectedProduct, [name]: value });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center">Product Catalog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product._id.$oid}
            className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 border border-gray-200 hover:border-gray-400 mb-8"
          >
            <h2 className="text-2xl font-semibold mb-4">{product.title}</h2>
            <p className="text-gray-700 mb-4">{product.description}</p>
            <div className="flex justify-between items-center">
              <p className="text-gray-900 font-bold text-lg">
                ${product.price}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Quantity: {product.quantity}</p>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75 mr-2"
                onClick={() => handleUpdateClick(product)}
              >
                Update product
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                onClick={() => handleDelete(product._id.$oid)}
              >
                Delete product
              </button>
            </div>
          </div>
        ))}
      </div>
      <Modal
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
      >
        {selectedProduct && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Update Product</h2>
            <form onSubmit={handleUpdateSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={selectedProduct.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={selectedProduct.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  name="price"
                  value={selectedProduct.price}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Image URL</label>
                <input
                  type="text"
                  name="img"
                  value={selectedProduct.img}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={selectedProduct.quantity}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AdminProduct;
