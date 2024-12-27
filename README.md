ProShop Installation & Setup Guide
Prerequisites
Before you begin, make sure you have the following:

Node.js (version 14 or higher)
MongoDB (local or MongoDB Atlas)
Git for cloning the repository
Step-by-Step Setup
1. Clone the Repository
Clone the ProShop repository to your local machine:

bash
Copy code
git clone https://github.com/tajshuvoo/proshop.git
cd proshop
2. Create Environment Variables
MongoDB URI: Set up a MongoDB database using MongoDB Atlas or locally.
Rename .env.example to .env and add the following variables:

bash
Copy code
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET='your_jwt_secret'
PAGINATION_LIMIT=8
Replace your_mongodb_uri and your_jwt_secret with your actual MongoDB URI and JWT secret. Adjust PAGINATION_LIMIT as needed.

3. Install Dependencies
Backend: Navigate to the backend folder and install dependencies:

bash
Copy code
cd backend
npm install
Frontend: Navigate to the frontend folder and install dependencies:

bash
Copy code
cd frontend
npm install
4. Running the Application
Run both frontend and backend (Frontend on port 3000, Backend on port 5000):

bash
Copy code
npm run dev
Run backend only:

bash
Copy code
npm run server
5. Build & Deploy
Create a production build for the frontend:
bash
Copy code
cd frontend
npm run build
6. Seed the Database
You can seed the database with sample data (users and products) or destroy all data using the following commands:

Import sample data:

bash
Copy code
npm run data:import
Destroy all data:

bash
Copy code
npm run data:destroy
Sample User Logins
Admin:
Email: admin@email.com
Password: 123456

Customer:
Email: john@email.com
Password: 123456

Customer:
Email: jane@email.com
Password: 123456

This guide should help you get started with ProShop. If you encounter any issues, feel free to check the official documentation or reach out for support.