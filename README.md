# FuelFix 🚗⛽
*Fix Your Journey in One Tap*

FuelFix is a **MERN stack web application** that helps travelers connect with nearby **mechanics** and **fuel providers** in case of emergencies like breakdowns or running out of fuel. The platform provides **real-time service requests, cancellations, and acceptance handling** to ensure quick roadside assistance.

---

## 🚀 Features
- **User & Mechanic Authentication**
  - Secure **JWT-based login**
  - **Email OTP verification** during signup
- **Service Requests**
  - Travelers can request mechanics/fuel providers
  - Request acceptance by mechanics
  - Request cancellation by both user and mechanic
- **Request Management**
  - Tracks **status** of requests (Pending, Accepted, Cancelled, Completed)
- **Database**
  - **MongoDB** used for storing users, mechanics, and service requests
- **Scalable Backend**
  - Built with **Node.js + Express.js** REST API
- **Frontend**
  - Built with **React.js** for a clean and responsive UI

---

## 📂 Project Structure
```
FuelFix/
│
├── backend/             # Node.js + Express server
│   ├── config/          # Database & environment configs
│   ├── controllers/     # Route controllers (Auth, Requests)
│   ├── models/          # Mongoose models (User, Mechanic, Request)
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions (OTP, JWT, etc.)
│   └── server.js        # Entry point
│
├── frontend/            # React.js frontend
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # React pages (Home, Login, Dashboard, etc.)
│   │   ├── services/    # API calls to backend
│   │   └── App.js       # Main app component
│   └── package.json
│
├── .env.example         # Example environment variables
├── package.json         # Root package
└── README.md            # Project documentation
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/sahilgupta0/fuleFix.git
cd FuelFix
```

### 2️⃣ Setup Backend
```bash
cd backend
npm install
```

- Create a `.env` file inside `backend/`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

- Start the backend:
```bash
npm run dev
```

### 3️⃣ Setup Frontend
```bash
cd ../frontend
npm install
npm start
```

Frontend will run at: `http://localhost:3000`  
Backend will run at: `http://localhost:5000`

---

## 🛠️ API Endpoints

### 🔑 Authentication
- `POST /api/auth/register` → Register new user (with OTP verification)
- `POST /api/auth/login` → Login user and return JWT

### 👨‍🔧 Mechanics
- `GET /api/mechanics` → Fetch all mechanics
- `POST /api/mechanics/:id/accept` → Accept service request

### 📌 Requests
- `POST /api/requests` → Create new service request
- `PUT /api/requests/:id/cancel` → Cancel request (User or Mechanic)
- `GET /api/requests/:id` → Get request details

---

## 📸 Screenshots
(Add some UI screenshots here if possible)

---

## 👨‍💻 Tech Stack
- **Frontend:** React.js, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT, Email OTP
- **Deployment:** Vercel (Frontend), Heroku/Render (Backend)

---

## 🚀 How to Run in Production
1. Build frontend:
```bash
cd frontend
npm run build
```
2. Serve build folder with backend:
```bash
cd ../backend
npm install serve -g
serve -s ../frontend/build
```

---

## 🤝 Contributing
Pull requests are welcome! For major changes, open an issue first to discuss what you’d like to change.

---

## 📜 License
This project is licensed under the **MIT License**.
