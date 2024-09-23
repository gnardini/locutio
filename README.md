# Locutio

[Locutio](https://locut.io) is an AI-powered Translation Management System. It makes it simple to use AI to translate your content across multiple languages.

![Demo](public/demo.mp4)
_Locutio_

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js
- Yarn package manager
- PostgreSQL database
- OpenAI API key

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   yarn
   ```

## Environment Setup

1. Copy the `.env.template` file to `.env`:
   ```
   cp .env.template .env
   ```
2. Fill in the required environment variables in the `.env` file:
   - `DB_HOST`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`: PostgreSQL database connection details
   - `JWT_SECRET`: A random secret for JWT token generation
   - Other optional variables for Resend and Stripe integration

## Running the Project

### Development Mode

To run the project in development mode:

```
yarn dev
```

This will start the server on `http://localhost:3000` (or the port specified in your .env file).

### Production Mode

To run the project in production mode:

Update your .env file:

```
NODE_ENV=production
```

1. Build the project:
   ```
   yarn build
   ```
2. Start the server:
   ```
   yarn start
   ```

## Optional Services

### LLM Logger (to keep track of translations)



## Note

Make sure the PostgreSQL database is running and accessible before starting the application.
