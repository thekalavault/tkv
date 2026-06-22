# The Kala Vault

Welcome to **The Kala Vault**, an exclusive platform dedicated to elevating corporate flagships and private residences through museum-grade art leasing, rotation, and bespoke curation.

## Project Structure

The project is structured as a monorepo containing two main parts:
- `frontend/`: The React web application
- `backend/`: The Express API server

## Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Animations**: Motion (Framer Motion) & Lenis (Smooth Scrolling)

### Backend
- **Framework**: Express.js + TypeScript
- **Database ORM**: Prisma
- **Auth/Storage**: Firebase Admin, Supabase
- **Queues**: BullMQ & Redis
- **Testing**: Jest & Supertest

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- PostgreSQL (or an equivalent SQL database connection via Prisma)
- Redis (for BullMQ queues)

### Environment Variables
You will need to set up `.env` files in both the `frontend/` and `backend/` directories. Refer to `.env.example` in those directories if available.

### Installation

1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Install backend dependencies:
   ```bash
   cd ../backend
   npm install
   ```

3. Setup Prisma:
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate dev
   ```

### Running the Application Locally

#### Backend
Start the backend development server (runs on default port, e.g., 3000):
```bash
cd backend
npm run dev
```

#### Frontend
Start the Vite development server (runs on port 4001):
```bash
cd frontend
npm run dev
```

Access the frontend via `http://localhost:4001`.

## Scripts

**Backend Scripts:**
- `npm run dev`: Starts the development server using `ts-node-dev`.
- `npm run build`: Compiles TypeScript to JavaScript.
- `npm start`: Runs the built application.
- `npm test`: Runs unit tests via Jest.
- `npm run seed`: Seeds the database with initial data.

**Frontend Scripts:**
- `npm run dev`: Starts Vite dev server.
- `npm run build`: Creates a production build.
- `npm run preview`: Previews the production build locally.
