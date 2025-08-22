# Charity Donation Frontend Application

## 📌 Overview
This is the **frontend** for a charity donation platform where users can support multiple causes such as **preventing animal cruelty** and **preventing child hunger**.  
The application provides a clean and responsive user interface, supports **user authentication**, **donation history viewing**, and **secure logout**, with integration points for backend APIs.

---

## 🎯 Features
- **User Authentication**
  - Login and registration forms with validation.
- **Cause-Based Donations**
  - Separate pages for different donation categories.
- **Donation History**
  - Displays all previous donations fetched from backend APIs.
- **Logout Functionality**
  - Securely ends the user session on frontend.
- **Responsive Design**
  - Works seamlessly on desktops, tablets, and mobiles.

---

## 🛠️ Tech Stack
- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**
- **React.js (Vite)**
- **Axios** for API calls
- **ESLint** for code quality

---

## 📂 Folder Structure
├── public/ # Static files (images, icons, etc.)
├── src/ # Frontend source code
│ ├── components/ # Reusable UI components
│ ├── pages/ # Login, Register, History, Donation pages
│ ├── services/ # API integration helpers
│ ├── App.js # Main application component
│ └── index.js # React entry point
├── index.html # Root HTML template
├── package.json # Dependencies and scripts
├── vite.config.js # Vite build configuration
└── README.md # Project documentation

---

## 📥 Installation & Setup
```bash
# Clone the repository
git clone https://github.com/yashwanth1239/charity-donation-frontend.git
cd charity-donation-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
