# Two-Factor Authentication with Google Authenticator

This project implements a two-factor authentication (2FA) system using Google Authenticator. It is built with NestJS and includes features such as user registration, JWT-based authentication, and 2FA using Google Authenticator.

## Features

- User registration and login
- JWT-based authentication
- Two-factor authentication (2FA) using Google Authenticator
- Secure storage of 2FA secrets

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher) or yarn
- MongoDB instance (local or cloud-based)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/2fa-nestjs.git
   cd 2fa-nestjs
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

3. **Create a `.env` file in the root directory and add your environment variables:**

   ```env
   JWT_SECRET=your_jwt_secret
   MONGODB_URI=mongodb+srv://your_mongodb_uri
   ```

## Running the Application

1. **Start the application:**

   ```bash
   npm run start
   ```

   or for development:

   ```bash
   npm run start:dev
   ```

2. **The application will be running at `http://localhost:3000`.**

## How the Project Works

### Authentication Flow

1. **User Registration:**

   - A new user registers by sending a `POST` request to `/auth/register` with their email and password.
   - The password is hashed before being stored in the database.
   - The user is saved to the MongoDB database.

2. **User Login:**

   - A user logs in by sending a `POST` request to `/auth/login` with their email and password.
   - The `LocalStrategy` validates the user credentials.
   - If valid, a JWT token is issued.

3. **Generating 2FA Secret:**

   - The user sends a `GET` request to `/auth/generate-2fa-secret` (protected by JWT).
   - A 2FA secret is generated using `speakeasy` and saved to the user's record in the database.
   - A QR code URL is returned, which the user can scan with Google Authenticator.

4. **Verifying 2FA Code:**

   - The user sends a `POST` request to `/auth/verify-2fa` with the 2FA code from Google Authenticator (protected by JWT).
   - The code is verified using `speakeasy`.
   - If valid, a new JWT token is issued with a flag indicating that 2FA is enabled.

5. **Accessing Protected Routes:**
   - The user can access protected routes by including the JWT token in the `Authorization` header.

### Project Structure

- `src/` - Source code directory
  - `auth/` - Authentication module
    - `auth.controller.ts` - Handles authentication routes
    - `auth.service.ts` - Contains authentication logic
    - `strategy/` - Contains JWT and Local strategies
  - `user/` - User module
    - `entities/` - User entity definition
    - `dto/` - Data Transfer Objects for user requests
  - `common/` - Common utilities and guards
  - `main.ts` - Application entry point
  - `app.module.ts` - Main application module

### API Endpoints

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login a user
- `GET /auth/generate-2fa-secret` - Generate 2FA secret (requires JWT)
- `POST /auth/verify-2fa` - Verify 2FA code (requires JWT)
- `GET /auth/profile` - Get user profile (requires JWT)

### Environment Variables

- `JWT_SECRET` - Secret key for JWT
- `MONGODB_URI` - MongoDB connection string

### Technologies Used

- **NestJS** - A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **MongoDB** - A NoSQL database for storing user data and 2FA secrets.
- **Speakeasy** - For generating and verifying 2FA codes.
- **QRCode** - For generating QR codes for 2FA setup.

## License

This project is licensed under the MIT License.
