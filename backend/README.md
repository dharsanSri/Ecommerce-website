# Backend (Express + MongoDB)

This folder contains a simple Express + MongoDB backend to handle cart operations for the React frontend.

## Setup

1. In this `backend` folder, install dependencies:

```bash
npm install express mongoose cors dotenv nodemon
```

2. (Optional but recommended) Create a `.env` file in the `backend` folder:

```bash
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce
```

3. Run the server:

```bash
npm run dev
```

The cart API will be available at `http://localhost:5000/api/cart`.

