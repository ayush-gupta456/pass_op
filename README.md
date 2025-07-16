# 🔐 PassKeeper - MERN Stack Password Manager

**PassKeeper** is a secure and lightweight password manager built with the MERN stack (MongoDB, Express, React, Node.js). It allows you to store and manage your website credentials securely.

---

## 🚀 Live Demo

👉 [Launch PassKeeper](https://passmongoop.netlify.app)

---

## 🧰 Tech Stack

- ⚛️ **React** – Component-based UI
- ⚡ **Vite** – Fast dev build tool
- 🎨 **Tailwind CSS** – Utility-first CSS for styling
- 🔔 **react-toastify** – Elegant toast notifications
- 🔑 **jsonwebtoken** – For generating JWT tokens
- 몽고 **MongoDB** - Database
- **Express** - Backend framework
- **Node.js** - Backend environment

---

## ✨ Features

- ✅ **User Authentication** - Secure user registration and login.
- ✅ **Save Credentials**  
  Store website name/URL, username, and password securely.
- 👁️ **Toggle Password Visibility**  
  Show or hide passwords while typing or viewing.
- 🔁 **Edit Credentials**  
  Easily update any saved login.
- 🗑️ **Delete Entries**  
  Remove any unwanted credentials.
- 📋 **Copy to Clipboard**  
  One-click copy for URLs, usernames, and passwords.
- 🔍 **Search Functionality**  
  Instantly filter saved credentials by site or username.
- 🔐 **Generate Strong Passwords**  
  One-click password generation with secure character sets.
- Forgot/Reset Password

---


## 🛠️ Getting Started

Follow these steps to run the app locally:

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/passop.git
cd passop
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Setup Environment Variables

- Create a `.env` file in the `backend` directory.
- Copy the content of `.env.example` to `.env`.
- Update the environment variables in `.env` with your own values.

### 4. Run the Application

```bash
# Start both servers together
npm run dev:full
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.
