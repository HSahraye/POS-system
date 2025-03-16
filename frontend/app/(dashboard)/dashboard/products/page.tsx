'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

// Sample product data
const products = [
  {
    id: '1',
    name: 'Basic Tee',
    category: 'Clothing',
    price: '$35.00',
    stock: 124,
    imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
  },
  {
    id: '2',
    name: 'Premium Hoodie',
    category: 'Clothing',
    price: '$75.00',
    stock: 89,
    imageUrl: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
  },
  {
    id: '3',
    name: 'Leather Wallet',
    category: 'Accessories',
    price: '$45.00',
    stock: 38,
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
  },
  {
    id: '4',
    name: 'Wireless Earbuds',
    category: 'Electronics',
    price: '$129.99',
    stock: 52,
    imageUrl: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
  },
  {
    id: '5',
    name: 'Coffee Mug',
    category: 'Home',
    price: '$15.00',
    stock: 215,
    imageUrl: 'https://images.unsplash.com/photo-1572119865084-43c285814d63?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
  },
  {
    id: '6',
    name: 'Notebook',
    category: 'Stationery',
    price: '$12.99',
    stock: 73,
    imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
  },
  {
    id: '7',
    name: 'Water Bottle',
    category: 'Accessories',
    price: '$25.00',
    stock: 105,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
  },
  {
    id: '8',
    name: 'Smartphone Case',
    category: 'Accessories',
    price: '$19.99',
    stock: 62,
    imageUrl: 'https://images.unsplash.com/photo-1601593346740-925612772716?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
  },
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all products in your store including name, price, and inventory status.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Add product
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="relative">
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 group-hover:opacity-75">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={500}
                height={500}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    <a href={`/dashboard/products/${product.id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">{product.price}</p>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {product.stock > 50 ? (
                    <span className="text-green-600">In stock ({product.stock})</span>
                  ) : product.stock > 0 ? (
                    <span className="text-yellow-600">Low stock ({product.stock})</span>
                  ) : (
                    <span className="text-red-600">Out of stock</span>
                  )}
                </p>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="rounded-md bg-white p-1 text-gray-400 hover:text-gray-500"
                  >
                    <PencilIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Edit</span>
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-white p-1 text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 