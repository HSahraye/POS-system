// Types
export interface Order {
  id: string;
  customer: string;
  date: string;
  items: number;
  amount: number;
  status: 'Completed' | 'Pending' | 'Processing' | 'Cancelled';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
  status: 'Active' | 'Inactive';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  reorderPoint: number;
  supplier: string;
  lastRestocked: string;
}

// Helper functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
};

export const formatDateTime = (date: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(new Date(date));
};

// Mock Data
export const mockOrders: Order[] = [
  {
    id: '#1001',
    customer: 'John Doe',
    date: '2024-03-10T14:30:00',
    items: 3,
    amount: 150.99,
    status: 'Completed'
  },
  {
    id: '#1002',
    customer: 'Jane Smith',
    date: '2024-03-10T15:45:00',
    items: 2,
    amount: 89.99,
    status: 'Pending'
  },
  {
    id: '#1003',
    customer: 'Bob Wilson',
    date: '2024-03-10T16:20:00',
    items: 1,
    amount: 45.50,
    status: 'Processing'
  },
  {
    id: '#1004',
    customer: 'Alice Brown',
    date: '2024-03-10T17:00:00',
    items: 4,
    amount: 199.99,
    status: 'Completed'
  },
  {
    id: '#1005',
    customer: 'Charlie Davis',
    date: '2024-03-10T17:30:00',
    items: 2,
    amount: 75.00,
    status: 'Cancelled'
  }
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    orders: 15,
    totalSpent: 1250.99,
    lastOrder: '2024-03-10T14:30:00',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 234-5678',
    orders: 8,
    totalSpent: 750.50,
    lastOrder: '2024-03-10T15:45:00',
    status: 'Active'
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob.wilson@example.com',
    phone: '(555) 345-6789',
    orders: 3,
    totalSpent: 250.00,
    lastOrder: '2024-03-10T16:20:00',
    status: 'Active'
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    phone: '(555) 456-7890',
    orders: 0,
    totalSpent: 0,
    lastOrder: '',
    status: 'Inactive'
  },
  {
    id: '5',
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    phone: '(555) 567-8901',
    orders: 12,
    totalSpent: 980.75,
    lastOrder: '2024-03-10T17:30:00',
    status: 'Active'
  }
];

export const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Coffee Beans - Dark Roast',
    category: 'Beverages',
    price: 14.99,
    stock: 50,
    reorderPoint: 20,
    supplier: 'Global Coffee Suppliers',
    lastRestocked: '2024-03-01'
  },
  {
    id: '2',
    name: 'Organic Green Tea',
    category: 'Beverages',
    price: 9.99,
    stock: 15,
    reorderPoint: 25,
    supplier: 'Tea Masters Co.',
    lastRestocked: '2024-03-05'
  },
  {
    id: '3',
    name: 'Chocolate Chip Cookies',
    category: 'Snacks',
    price: 4.99,
    stock: 100,
    reorderPoint: 30,
    supplier: 'Sweet Treats Inc.',
    lastRestocked: '2024-03-08'
  },
  {
    id: '4',
    name: 'Whole Grain Bread',
    category: 'Bakery',
    price: 3.99,
    stock: 25,
    reorderPoint: 15,
    supplier: 'Local Bakery Ltd.',
    lastRestocked: '2024-03-10'
  },
  {
    id: '5',
    name: 'Fresh Milk',
    category: 'Dairy',
    price: 2.99,
    stock: 40,
    reorderPoint: 20,
    supplier: 'Dairy Farms Co.',
    lastRestocked: '2024-03-10'
  }
]; 