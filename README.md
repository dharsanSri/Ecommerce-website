# HappyKart – E-Commerce Website

A full-stack e-commerce web app with product listing, cart, and orders. **Frontend:** React. **Backend:** Express + MongoDB. **Products:** fetched from Fake Store API. **Cart & orders:** stored in your backend.

---

## What’s used (tech stack)

| Part       | Used in this project                |
| ---------- | ------------------------------------ |
| Frontend   | React 18, Redux, React Router, Axios |
| Backend    | Node.js, Express 5, Mongoose        |
| Database   | MongoDB                             |
| Product data | Fake Store API (GET products only) |

---

## Features (current)

- **Home** – Products by category (Men's / Women's Clothing, Electronics, Jewellery), grid layout, Add to Cart, prices in ₹
- **Cart** – Add/remove/change quantity; guest user via `localStorage`; name, mobile, address for checkout
- **Orders** – Place order, view history with items and totals
- **Offers** – 10% off on clothing when clothing total > ₹500; 15% off on electronics & jewellery when that total > ₹1000
- **UI** – Inter font, gradient background, navbar (HappyKart center, Home/Cart/Orders left, cart count right)

---

## Project structure

```
E-Website/
├── E-Commerce-React/     # Frontend
│   ├── src/
│   │   ├── apis/         # backendApi, callApi (Fake Store)
│   │   ├── componets/    # Navbar, CardProducts
│   │   ├── pages/        # Home, Cart, Orders, Product
│   │   ├── redux/
│   │   └── utils/        # productCategories (offers)
│   └── package.json
├── backend/              # Backend
│   ├── src/
│   │   ├── models/       # CartItem, Order
│   │   ├── routes/       # cart, orders
│   │   └── server.js
│   ├── .env              # PORT, MONGODB_URI
│   └── package.json
├── screenshots/          # Your UI screenshots
└── README.md
```

---

## Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

---

## Installation

**Backend**

```bash
cd backend
npm install
```

In `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce
```

**Frontend**

```bash
cd E-Commerce-React
npm install
```

Backend URL is in `E-Commerce-React/src/apis/backendApi.js` (`http://localhost:5000/api`). Change if your backend uses another host/port.

---

## Run

1. Start MongoDB (if local).
2. Backend: `cd backend` then `npm run dev` → `http://localhost:5000`
3. Frontend: `cd E-Commerce-React` then `npm start` → `http://localhost:3000`

---

## API (used by the app)

| Method | Endpoint | Use |
| ------ | -------- | --- |
| GET | `/api/health` | Health check |
| GET | `/api/cart` | Get cart (`x-user-id` header) |
| POST | `/api/cart` | Add to cart |
| PATCH | `/api/cart/:productId` | Change quantity (`action`: increase / decrease) |
| DELETE | `/api/cart/:productId` | Remove from cart |
| POST | `/api/orders` | Create order (with optional category discounts) |
| GET | `/api/orders` | Get user orders |

Products are loaded from **Fake Store API** in the frontend; the backend is not used for product listing.

---


