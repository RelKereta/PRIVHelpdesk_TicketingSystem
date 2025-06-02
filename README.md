<div align="center">
  <img src="assetsORimages/PRIVLogo.jpg" width="300" height="auto" />
  
  # PRIV Helpdesk Ticketing System
  ### WADS Final Project, Binus University Global Class
</div> 
  
 ### Contributors: (L4AC)
  1)  Raisya Jasmine Zahira
  2)  Farrell Sevillen Arya
  3)  Emanuella Ivana Karunia
  4)  Marsya Putra

 
 ## Installation Guide 
 
 1) Install Dependencies for both frontend and backend:
     - npm install (backend):
        - express
        - mongoose
        - cos
        - dotenv
     - npm install (frontend)
        - react-router-dom (handling routing in React)
        - react and react-don (UI Building)

  ## Note (when running)  
  - make sure you have MongoDB runing locally (check environment variables and set it up)
      OR MongoDB Atlas for could storage (chat raisya for access)
  - pls double check you're in correct directory or no
  - npm run dev (frontend)
  - npm start (backend) OR node server.js
    
  > Currently consisting:
- Vite + React
- CSS (not yet tailwind -- but plan 2)
- API Endpoint - POST tickets
  

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ recommended) ✅ *You have v22.13.1*
- MongoDB (installed and running) ✅ *Already configured*
- npm or yarn ✅ *You have npm v11.3.0*

### 🏃‍♂️ Running the Application

#### Option 1: Start Frontend and Backend Separately

**Start Backend:**
```bash
cd backend/server
npm start
```
Backend will run on: http://localhost:3000

**Start Frontend:**
```bash
cd frontend
npm start
```
Frontend will run on: http://localhost:5173

#### Option 2: Use Project Root Scripts

From the project root directory:

```bash
# Start backend only
npm run start:backend

# Start frontend only  
npm run start:frontend

# Install concurrently and start both (recommended)
npm install
npm run dev
```

### 🔧 Environment Setup

The backend requires a `.env` file in `backend/server/`. The following environment variables are configured:

```env
MONGO_URI=mongodb://localhost:27017/priv-helpdesk
JWT_SECRET=PRIV_Helpdesk_2024_Secure_JWT_Secret_Key_8x9y2z1w4v3u6t7sg7
SESSION_SECRET=PRIV_Helpdesk_Session_Secret_2024
PORT=3000
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 📊 Database Setup

Initialize the database with sample data:

```bash
npm run init-db
```

This creates:
- Sample users (admin, agent, regular user)
- Sample tickets
- Proper database schema

### 👥 Default Users

After database initialization, you can login with:

| Role | Username | Email | Password |
|------|----------|-------|----------|
| Admin | admin | admin@priv.com | admin123 |
| Agent | agent1 | agent1@priv.com | agent123 |
| User | user1 | user1@priv.com | user123 |

### 🔗 API Endpoints

- **Health Check:** http://localhost:3000/health
- **API Base:** http://localhost:3000/api/
- **Users:** http://localhost:3000/api/users
- **Tickets:** http://localhost:3000/api/tickets
- **Auth:** http://localhost:3000/api/auth

### 🎯 Features

- **User Management:** Role-based access (Admin, Agent, User)
- **Ticket System:** Create, assign, track, and resolve tickets
- **Dashboard:** Overview of tickets and statistics
- **Comments:** Add comments to tickets
- **File Attachments:** Upload files to tickets
- **SLA Management:** Automatic deadline tracking
- **Search & Filter:** Find tickets quickly
- **Real-time Updates:** Live ticket status updates

### 🛠️ Development

**Backend Development:**
```bash
cd backend/server
npm run dev  # Uses nodemon for auto-restart
```

**Frontend Development:**
```bash
cd frontend
npm run dev  # Uses Vite with hot reload
```

### 🏗️ Project Structure

```
PRIVHelpdesk_TicketingSystem/
├── backend/
│   └── server/
│       ├── models/          # Database models
│       ├── routes/          # API routes
│       ├── controllers/     # Business logic
│       ├── middleware/      # Auth & validation
│       ├── config/          # Database & OAuth config
│       └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   └── services/       # API services
│   └── public/             # Static assets
└── README.md
```

### ⚡ Status

✅ **Backend:** Running on port 3000  
✅ **Frontend:** Running on port 5173  
✅ **Database:** MongoDB connected with sample data  
✅ **Authentication:** JWT-based auth working  
⚠️ **Google OAuth:** Not configured (optional)

### 🔧 Troubleshooting

**Backend won't start:**
- Check if MongoDB is running: `Get-Service -Name MongoDB`
- Verify .env file exists in `backend/server/`
- Check port 3000 is not in use

**Frontend won't start:**
- Check if port 5173 is available
- Run `npm install` in frontend directory

**Database issues:**
- Run database initialization: `npm run init-db`
- Check MongoDB connection string in .env

### 📝 Notes

- Google OAuth is optional and disabled by default
- The system works with local authentication
- Sample data is created automatically
- All dependencies are installed and ready
