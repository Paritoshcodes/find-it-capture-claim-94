
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/158b12c2-0b08-4493-835a-ef05871bf7b7

## MySQL Database Setup

This project uses MySQL to store data. Follow these steps to set up the database:

1. Ensure you have MySQL installed and running on your machine
2. Create a new `.env` file in the root directory (copy from `.env.example`)
3. Update the `.env` file with your MySQL credentials
4. Import the database schema:

```sh
# Connect to MySQL
mysql -u your_username -p

# Once connected, run the schema.sql file
source server/schema.sql
```

## Default Admin Login

Username: admin@lostfound.com
Password: admin123

## Development Setup

```sh
# Install dependencies
npm i

# Start the backend server
node server/index.js

# In another terminal, start the frontend
npm run dev
```

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/158b12c2-0b08-4493-835a-ef05871bf7b7) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- MySQL
- Express

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/158b12c2-0b08-4493-835a-ef05871bf7b7) and click on Share -> Publish.

Don't forget to set up the MySQL database on your deployment server as well.
