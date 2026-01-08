# Trading Journal Application

## 📋 Overview

The Trading Journal is a comprehensive web application designed for traders to track, analyze, and learn from their trading activities. It provides a secure and intuitive platform for managing trading data, analyzing performance metrics, and improving trading strategies.

## 🚀 Features

### 🔐 Authentication & Security

- **Secure Registration & Login**: JWT-based authentication with role-based access control
- **Email Verification**: Required for account activation
- **Admin Approval System**: New accounts require admin approval
- **Password Management**: Secure password reset via email
- **Multi-role System**: USER, ADMIN, SUPER_ADMIN roles with different permissions

### 📊 Trade Management

- **Complete Trade Tracking**: Record entry/exit prices, quantities, timestamps
- **Advanced Calculations**: Automatic PnL calculation with leverage support
- **Trade Organization**: Tags, notes, and scoring system
- **Status Management**: OPEN/CLOSED trade status tracking
- **Performance Analytics**: Win rate, total PnL, best/worst trades analysis

### 👥 User Management

- **Admin Dashboard**: User approval, activation/deactivation
- **Profile Management**: User information and settings
- **Activity Tracking**: Last login timestamps and account status

### 🛡️ System Features

- **Health Monitoring**: System status and uptime tracking
- **Error Handling**: Comprehensive error responses with details
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Robust validation for all API endpoints

## 🏗️ Technology Stack

### Backend

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod schema validation
- **Security**: bcrypt for password hashing, CORS protection
- **Environment**: Dotenv for configuration

## 📁 Project Structure

```
trading-journal/
|──docs/
|   ├──API_DOCUMENTATION.md # Complete API documentation
|   ├──openapi.yaml
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, validation, error handling
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   ├── types/           # TypeScript type definitions
│   └── prisma/          # Database schema and migrations
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── prisma/schema.prisma # Database schema
├──
└── README.md           # This file
```

## 📚 API Documentation

Complete API documentation with detailed endpoint specifications, request/response examples, error codes, and frontend integration guidelines is available in the [API Documentation](../backend/docs/API_DOCUMENTATION.md) file.
[SwaggerApi](../public-docs/openapi.yaml)

**Key Documentation Sections:**

- Authentication & Authorization workflows
- Trade management endpoints with PnL calculations
- Admin operations and user management
- Error handling and status codes
- Frontend integration examples
- Testing scenarios and examples

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ or Bun runtime
- PostgreSQL 14+
- npm, yarn, or bun package manager

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-org/trading-journal.git
cd trading-journal
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
bun install
```

3. **Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/trading_journal"
JWT_SECRET="your-super-secret-jwt-key-change-this"
NODE_ENV="development"
PORT=5000
```

4. **Set up database**

```bash
# Run migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
```

5. **Start the development server**

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

The API will be available at `http://localhost:5000`

## 🔧 Development

### Available Scripts

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run database migrations
npm run migrate

# Generate Prisma client
npm run prisma:generate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Lint code
npm run lint

# Format code
npm run format
```

### Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting
- Write comprehensive JSDoc comments

## 🗄️ Database Schema

### Main Tables

- `User` - User accounts and authentication
- `Trade` - Trading records with calculations
- `Token` - Authentication and verification tokens

## 🔐 Security Features

1. **Password Security**
   - bcrypt hashing with salt rounds
   - Minimum password requirements (8+ chars, uppercase, lowercase, number)
   - Secure password reset flow with email tokens

2. **Authentication**
   - JWT tokens with 30-minute expiration for access tokens
   - Refresh tokens with 7-day expiration
   - Token blacklisting on logout

3. **Data Protection**
   - SQL injection prevention via Prisma ORM
   - Input validation using Zod schemas
   - CORS configuration for cross-origin requests
   - Rate limiting on authentication endpoints

4. **Authorization**
   - Role-based access control (USER, ADMIN, SUPER_ADMIN)
   - Resource ownership validation (users can only access their own trades)
   - Admin-only endpoints protection

## 📈 Deployment

### Production Checklist

- Update all environment variables with production values
- Set up PostgreSQL database with proper backup configuration
- Configure SSL certificates for HTTPS
- Set up application monitoring and logging
- Configure load balancer if needed

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@prod-db:5432/trading_journal"
JWT_SECRET="strong-production-secret"
PORT=5000
CORS_ORIGIN="https://yourapp.com"
```

## 🧪 Testing

The application has been manually tested with the following scenarios:

### Authentication Testing ✅

- User registration with admin approval workflow
- Email verification process
- Login with correct and incorrect credentials
- Token refresh functionality
- Logout with token invalidation

### Trade Management Testing ✅

- Create trade with all required fields
- Update trade with exit price (changes status to CLOSED)
- Automatic PnL calculation verification
- Trade deletion
- Trade statistics calculation

### Admin Operations Testing ✅

- Pending users list retrieval
- User approval workflow
- User activation/deactivation
- SUPER_ADMIN protection (cannot be deactivated)

### Error Handling Testing ✅

- Invalid token responses (401)
- Validation errors (400)
- Permission errors (403)
- Resource not found (404)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For API-related questions and issues, please refer to the comprehensive [API Documentation](./API_DOCUMENTATION.md) which includes:

- Detailed endpoint specifications
- Request/response examples
- Error handling guidelines
- Frontend integration examples

For additional support:

1. Search existing issues
2. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details

## 🚨 Troubleshooting

### Common Issues and Solutions

1. **Database Connection Issues**

   ```bash
   # Verify PostgreSQL is running
   sudo service postgresql status

   # Check connection
   psql -U username -d trading_journal
   ```

2. **Migration Errors**

   ```bash
   # Reset and recreate database
   npx prisma migrate reset
   npx prisma migrate dev
   npx prisma generate
   ```

3. **JWT Token Issues**
   - Verify JWT_SECRET is set in .env file
   - Check token expiration (access: 30min, refresh: 7days)
   - Ensure Authorization header format: `Bearer <token>`

4. **Port Already in Use**
   ```bash
   # Find and kill process using port 5000
   lsof -ti:5000 | xargs kill -9
   ```

### Debug Mode

Enable debug logging for troubleshooting:

```bash
DEBUG=* npm run dev
```

## 🙏 Acknowledgments

- Built with modern web development best practices
- Focus on security and data integrity
- Designed for scalability and maintainability
- Comprehensive error handling and user feedback

---

**Version:** 2.0.0  
**Last Updated:** January 2026  
**Status:** ✅ in Development
