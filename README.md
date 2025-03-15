# POS System

A modern Point of Sale system built with Node.js, Express, TypeScript, and React.

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd pos-system
```

2. Install dependencies for all packages:
```bash
npm run install:all
```

3. Set up the database:
- Create a PostgreSQL database named `pos_system`
- Update the database configuration in `backend/.env` if needed

4. Set up environment variables:
- Copy `backend/.env.example` to `backend/.env` and update the values
- Update the JWT secret and Stripe keys

5. Run database migrations:
```bash
cd backend
npm run migration:run
```

6. Start the development servers:
```bash
# In the root directory
npm run dev
```

This will start both the backend and frontend servers:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## Features

- User authentication and authorization
- Product management
- Customer management
- Order processing
- Payment handling (Cash, Card)
- Loyalty points system
- Inventory tracking
- Sales reporting

## API Documentation

The API endpoints are available at:
- `/api/users` - User management
- `/api/customers` - Customer management
- `/api/products` - Product management
- `/api/orders` - Order management
- `/api/payments` - Payment processing

## Development

- Backend: Express.js with TypeScript
- Frontend: React with TypeScript
- Database: PostgreSQL with TypeORM
- Authentication: JWT
- Payment Processing: Stripe

## Default Users

After initial setup, the following default users are created:

- **Admin**
  - Email: admin@example.com
  - Password: admin123

- **Manager**
  - Email: manager@example.com
  - Password: manager123

- **Employee**
  - Email: employee@example.com
  - Password: employee123

## Testing

Run tests for both frontend and backend:

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Deployment

1. **Update Environment Variables**
   - Set `NODE_ENV=production`
   - Update API URLs and database configuration
   - Set secure JWT secret
   - Configure Stripe keys
   - Set up email credentials

2. **Build and Deploy**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

3. **Database Migrations**
   ```bash
   docker-compose exec backend npm run migration:run
   ```

## Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Role-based access control for different user types
- HTTPS required in production
- API rate limiting implemented
- SQL injection protection with TypeORM
- XSS protection with React
- CORS configured for security

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@example.com or create an issue in the repository. 