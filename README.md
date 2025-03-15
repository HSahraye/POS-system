# POS System

A modern Point of Sale (POS) system with a Next.js frontend and Node.js backend.

## Features

- User authentication (login/signup)
- Dashboard with sales overview and analytics
- Inventory management
- Order processing
- Customer management
- Payment processing

## Tech Stack

### Frontend
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Chart.js for data visualization

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL with TypeORM
- JWT for authentication

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL

### Installation

1. Clone the repository:
```bash
git clone https://github.com/HSahraye/POS-system.git
cd POS-system
```

2. Install dependencies for both frontend and backend:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5001
   JWT_SECRET=your_jwt_secret
   DATABASE_URL=postgresql://username:password@localhost:5432/pos_system
   ```

4. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd ../frontend
npm run dev
```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## Default Login Credentials

- Email: test@example.com
- Password: test123

## License

This project is licensed under the MIT License. 