# Express API Starter with TypeScript

A modern Express.js API starter template with TypeScript, Drizzle ORM, JWT Authentication, and more.

## Features

### Core Dependencies
* [Express](https://expressjs.com/) - Fast, unopinionated web framework for Node.js
* [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
* [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM for SQL databases
* [PostgreSQL](https://www.postgresql.org/) - Open source relational database

### Authentication & Security
* [JWT](https://jwt.io/) - JSON Web Token for authentication
* [bcrypt](https://www.npmjs.com/package/bcrypt) - Password hashing
* [helmet](https://helmetjs.github.io/) - Security middleware
* [cors](https://www.npmjs.com/package/cors) - Cross-Origin Resource Sharing

### Utilities
* [zod](https://zod.dev/) - TypeScript-first schema validation
* [morgan](https://www.npmjs.com/package/morgan) - HTTP request logger
* [dotenv](https://www.npmjs.com/package/dotenv) - Environment variables management

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# JWT
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"

# Server
PORT=3000
```

### 3. Database Setup

#### Initialize Drizzle
```bash
# Generate migrations
npx drizzle-kit generate:pg

# Push migrations to database
npx drizzle-kit push:pg
```

## Development

```bash
# Run in development mode
npm run dev

# Run in production mode
npm run build && npm run start:dist

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Testing

```bash
# Run tests
npm run test
```

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── db/
│   ├── migrations/ # Database migrations
│   └── schema/     # Drizzle schema definitions
├── helpers/        # Helper functions
├── middleware/     # Express middleware
├── routes/         # Route definitions
└── types/          # TypeScript type definitions
```

## API Authentication

The API uses JWT for authentication. Here's how it works:

1. **Register**: Create a new user account
   - Endpoint: `POST /api/auth/register`
   - Body: `{ email: string, password: string }`

2. **Login**: Authenticate and receive tokens
   - Endpoint: `POST /api/auth/login`
   - Body: `{ email: string, password: string }`
   - Returns: `{ accessToken: string, refreshToken: string }`

3. **Protected Routes**: Include the access token in headers
   ```
   Authorization: Bearer <access_token>
   ```

4. **Token Refresh**: Get a new access token using refresh token
   - Endpoint: `POST /api/auth/refresh`
   - Body: `{ refreshToken: string }`

## Available Scripts

- `npm start` - Start the server using ts-node
- `npm run dev` - Start the server in development mode with nodemon
- `npm run build` - Build the project
- `npm run start:dist` - Start the built project
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run typecheck` - Check TypeScript types

## License

MIT
