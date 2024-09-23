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
- GitHub OAuth App (for GitHub integration)

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
   - `OPENAI_API_KEY`: Your OpenAI API key (see below for instructions)
   - `PUBLIC_ENV__GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`: GitHub OAuth App credentials (see below for instructions)

### Getting an OpenAI API Key

1. Go to [OpenAI's website](https://openai.com/) and sign up or log in
2. Navigate to the API section
3. Create a new API key
4. Copy the API key and paste it into your `.env` file as `OPENAI_API_KEY`

### Setting up GitHub OAuth App

1. Go to your GitHub account settings
2. Navigate to "Developer settings" > "OAuth Apps"
3. Click "New OAuth App"
4. Fill in the application details (use `http://localhost:3000/github_callback` for the callback URL in development)
5. After creating the app, you'll see the Client ID and can generate a Client Secret
6. Add these to your `.env` file as `PUBLIC_ENV__GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`

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

### LLM Logger

LLM Logger is a tool that helps you keep track of your AI API calls. It's particularly useful when building AI products, as it allows you to monitor how your AI behaves in real-world scenarios.

To use LLM Logger:
1. Sign up at [https://llmlogger.com/](https://llmlogger.com/)
2. Obtain your API key
3. Add the API key to your `.env` file as `LLM_LOGGER_API_KEY`

For more information, visit [LLM Logger](https://llmlogger.com/).

## Note

Make sure the PostgreSQL database is running and accessible before starting the application.