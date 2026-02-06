# Money Manager - Frontend

A premium Money Manager web application to track income, expenses, transfers, categories, accounts, and spending reports with a modern dashboard UI.

This project helps users manage personal and office finances with analytics, filters, and interactive charts.

---

## Live Demo
🔗 Frontend URL: **(Add your deployed Vercel link here)**

---

## Features

    Dashboard (Weekly / Monthly / Yearly overview)  
    Recent transaction history  
    Floating Add Transaction button  
    Transactions page with filters (Division, Category, Type, Date Range)  
    CSV Export for transactions  
    Category Summary page with donut chart  
    Reports page with charts (trend + donut + balance ring)  
    Accounts page with account-wise history  
    Transfer transactions (Account → Account)  
    Dark / Light mode  
    Modern premium UI using TailwindCSS  

---

##  Tech Stack

- React.js (Vite)
- TailwindCSS
- Recharts (Charts)
- Lucide Icons
- Node.js Backend API
- MongoDB Atlas

---

## 📂 Project Structure

src/
├── components/
├── pages/
├── services/
├── App.jsx
├── main.jsx


---

## ⚙️ Installation & Setup

### 1️. Clone the repo
```bash
git clone https://github.com/<your-username>/money-manager-frontend.git
cd money-manager-frontend

### 2. Install dependencies

    npm install

### 3. Create .env file

    Create a file named .env in the root folder:

    VITE_API_URL=https://your-backend-url.com

    Example:

    VITE_API_URL=https://money-manager-backend.onrender.com


### 4. Run Locally

    npm run dev

    Now open:
                http://localhost:5173