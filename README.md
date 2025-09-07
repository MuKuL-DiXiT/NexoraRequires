🛒 Astraperequire – Full-Stack E-Commerce Platform

Welcome to Astraperequire, a modern full-stack e-commerce web application built with Next.js, Express.js, and MongoDB.
It’s fast ⚡, secure 🔐, and designed to scale 📈.

✨ Features

🔑 Authentication – Secure signup/login with JWT

🛍️ Product Catalog – Categories & items with image uploads (Multer)

🛒 Shopping Cart – Add, remove, and manage items

👑 Admin Controls – Restricted routes with middleware for product management

📦 API First – REST API for all resources (users, items, categories, cart)

🌐 Deployed –

Frontend → Vercel

Backend → Render

Database → MongoDB Atlas

🏗️ Tech Stack

Frontend: Next.js + TypeScript + Tailwind CSS

Backend: Node.js + Express.js

Database: MongoDB (Atlas)

Deployment: Vercel (frontend) + Render (backend)

🚀 Architecture
flowchart TD
  A[Frontend - Next.js (Vercel)] -->|Fetch API| B[Backend - Express (Render)]
  B --> C[Database - MongoDB Atlas]
-----------------------------------------------------------------------------------------------------------------------------------------------------------------\
        L        O        C        A        L    ---     D         E        V        E        L        O        P        M        E        N        T            =>
-----------------------------------------------------------------------------------------------------------------------------------------------------------------/

# Clone repo
git clone https://github.com/your-username/astraperequire.git
cd astraperequire

# Run backend
cd server
npm install
npm start

# Run frontend
cd frontend
npm install
npm run dev
