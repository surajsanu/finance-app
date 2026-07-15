# Finance Portfolio Tracker

A full-stack web application for tracking and managing your investment portfolio. Built as a demonstration of modern full-stack development practices.

## Features

- **User Authentication**: Secure registration and login with JWT-based authentication
- **Investment Management**: Create, read, update, and delete investments
- **Portfolio Dashboard**: Overview of total invested, current value, profit/loss, and returns
- **Filtering & Search**: Filter investments by type, search by name
- **Sorting & Pagination**: Sort by various fields with paginated results
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** with **NestJS** framework
- **TypeScript** for type safety
- **PostgreSQL** database
- **Prisma ORM** for database operations
- **JWT** for authentication
- **bcrypt** for password hashing
- **class-validator** for DTO validation
- **Swagger** for API documentation

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Hook Form** with **Zod** for form validation
- **TanStack Query** for server state management
- **Axios** for API requests

### DevOps
- **Docker** & **Docker Compose** for containerization
- **ESLint** & **Prettier** for code quality
- **Jest** for testing

## Architecture Overview

```
finance-portfolio-tracker/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # Users module
│   │   ├── investments/    # Investments CRUD module
│   │   ├── portfolio/      # Portfolio summary module
│   │   └── prisma/         # Database module
│   └── prisma/
│       └── schema.prisma   # Database schema
├── frontend/               # Next.js application
│   └── src/
│       ├── app/            # App Router pages
│       ├── components/     # React components
│       ├── contexts/       # React contexts
│       ├── hooks/          # Custom hooks
│       ├── lib/            # Utilities & services
│       └── types/          # TypeScript types
├── docker-compose.yml      # Docker configuration
└── README.md
```

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ (or Docker)
- Git

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd finance-portfolio-tracker
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your database credentials if needed
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Update NEXT_PUBLIC_API_URL if your backend runs on a different port
```

## Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/finance_portfolio?schema=public` |
| `JWT_SECRET` | Secret key for JWT signing | `your-super-secret-jwt-key-change-in-production` |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `PORT` | Backend server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

### Frontend (.env.local)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001` |

## Database Setup

### Option 1: Using Docker (Recommended)

```bash
# Start PostgreSQL container
docker compose up -d postgres

# The database will be available at localhost:5432
```

### Option 2: Local PostgreSQL

1. Install PostgreSQL
2. Create a database named `finance_portfolio`
3. Update the `DATABASE_URL` in backend `.env`

### Run Migrations

```bash
cd backend

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

## Running the Application

### Development Mode

**Backend:**
```bash
cd backend
npm run start:dev
```
The API will be available at `http://localhost:3001`

**Frontend:**
```bash
cd frontend
npm run dev
```
The application will be available at `http://localhost:3000`

### Using Docker Compose

```bash
# Start all services (PostgreSQL, Backend, Frontend)
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

## API Documentation

Swagger documentation is available in development mode at:

```
http://localhost:3001/api/docs
```

### API Endpoints

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and get JWT |
| GET | `/auth/me` | Get current user profile |

#### Investments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/investments` | List investments (with pagination, filtering, sorting) |
| POST | `/investments` | Create a new investment |
| GET | `/investments/:id` | Get a single investment |
| PUT | `/investments/:id` | Update an investment |
| DELETE | `/investments/:id` | Delete an investment |

#### Portfolio
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/portfolio/summary` | Get portfolio summary statistics |

### Query Parameters for GET /investments

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `type` | string | Filter by investment type |
| `search` | string | Search by investment name |
| `sortBy` | string | Sort field (investmentName, investedAmount, currentValue, purchaseDate, createdAt) |
| `order` | string | Sort order (asc, desc) |

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm run test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

The test suite includes:
- Authentication service tests
- Portfolio summary calculation tests
- Investment ownership protection tests

## Project Structure Details

### Backend Modules

- **AuthModule**: Handles user registration, login, and JWT validation
- **UsersModule**: User data management
- **InvestmentsModule**: CRUD operations for investments with ownership validation
- **PortfolioModule**: Portfolio summary calculations
- **PrismaModule**: Database connection and operations

### Frontend Components

- **Layout**: Sidebar navigation, authentication guards
- **Dashboard**: Portfolio summary cards, recent investments
- **Investments**: Investment table, forms, filters, pagination

## Security Considerations

- Passwords are hashed using bcrypt with 12 salt rounds
- JWT tokens are used for stateless authentication
- All investment endpoints enforce user ownership at the backend level
- Input validation is performed on both frontend and backend
- CORS is configured to allow only specified origins
- Sensitive data is never exposed in API responses

## Deployment

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm run start:prod
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

### Docker Deployment

```bash
docker compose -f docker-compose.yml up -d --build
```

### Environment Considerations

For production deployment:
1. Use strong, unique `JWT_SECRET`
2. Configure proper `CORS_ORIGIN`
3. Use a managed PostgreSQL instance
4. Set `NODE_ENV=production`
5. Consider adding rate limiting
6. Use HTTPS

## Future Improvements

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Investment performance charts
- [ ] Investment categories breakdown
- [ ] Export data to CSV/PDF
- [ ] Multi-currency support
- [ ] Investment transaction history
- [ ] Dividend tracking
- [ ] Price alerts
- [ ] Dark mode toggle

## Screenshots

*Add screenshots of the application here*

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
