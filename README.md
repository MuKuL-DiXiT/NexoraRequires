NexoraRequires: Documentation
Overview
NexoraRequires is a full-stack e-commerce single-page web application built as part of an internship assignment.
 It provides user authentication, product management, filtering, a persistent shopping cart, and a checkout system that generates a downloadable purchase receipt.
 The application includes both backend APIs and a responsive, professional frontend interface.

Features
Authentication
User signup and login using JWT-based authentication


Session persistence with secure access and refresh tokens


Products
Create, read, update, and delete (CRUD) APIs for items


Filtering by price range and product category


Cart and Checkout
Add and remove items to and from the cart


Persistent cart data maintained across sessions


Checkout process generates a downloadable receipt (PDF)


Cart automatically clears after successful checkout


Frontend
User-friendly signup and login pages


Product listing with dynamic filtering


Cart management and checkout interface


Responsive and modern UI using Tailwind CSS



Tech Stack
Layer
Technologies Used
Frontend
Next.js (React) + TypeScript + Tailwind CSS
Backend
Node.js + Express.js
Database
MongoDB Atlas
Authentication
JWT
Deployment
Vercel (frontend) and Render (backend)


Architecture
flowchart TD
  A[Frontend - Next.js (Vercel)] -->|JWT, Fetch API| B[Backend - Express (Render)]
  B --> C[Database - MongoDB Atlas]


Folder Structure
.
├── frontend/       # Next.js SPA (Vercel)
│   ├── src/
│   └── public/
└── server/         # Express.js API (Render)
    ├── controllers/
    ├── models/
    ├── routes/
    └── index.js


Environment Variables
Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://nexorarequires.onrender.com

Backend (.env)
Contains MongoDB connection URI, JWT secrets (access and refresh tokens), and optional OAuth credentials.

API Documentation
Authentication
POST /api/auth/signup → Create a new user


POST /api/auth/login → Authenticate user and issue JWT tokens


Items
GET /api/items?category=shoes&price_lte=500 → Get filtered product list


POST /api/items → Create a new item (admin only)


PUT /api/items/:id → Update an existing item


DELETE /api/items/:id → Delete an item


Cart
POST /api/cart → Add item to cart


DELETE /api/cart/:id → Remove item from cart


GET /api/cart → Retrieve user’s persistent cart


Checkout
POST /api/checkout → Process order, generate receipt, and clear cart



Local Development Setup
# Clone repository
git clone https://github.com/MuKuL-DiXiT/NexoraRequires.git
cd NexoraRequires

# Backend
cd server
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev

Open in browser: http://localhost:3000


