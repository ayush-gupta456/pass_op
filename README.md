
# 🔐 PassKeeper - MERN Stack Password Manager

**PassKeeper** is a secure, responsive, and lightweight password manager built with the MERN stack (MongoDB, Express, React, Node.js). It allows users to manage and store their login credentials with ease and confidence.

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-netlify-badge/deploy-status)](https://passmongoop.netlify.app)

---

## 🚀 Live Demo

🌐 **[Launch PassKeeper](https://passmongoop.netlify.app)** – Try it live!

---

## 🧰 Tech Stack

- ⚛️ **React** – Frontend UI  
- ⚡ **Vite** – Fast modern frontend tooling  
- 🎨 **Tailwind CSS** – Utility-first CSS styling  
- 🔔 **React-Toastify** – For toast notifications  
- 🔐 **JWT (jsonwebtoken)** – Auth token management  
- 🛢️ **MongoDB** – Cloud/Local NoSQL database  
- 🌐 **Express.js** – Backend framework  
- 🖥️ **Node.js** – JavaScript runtime for server  

---

## ✨ Features

- 🔐 **Secure Login/Register**
- 💾 **Store Website Credentials**
- 🔁 **Edit / Delete Stored Entries**
- 👁️ **Toggle Password Visibility**
- 📋 **One-Click Copy for URLs, Passwords**
- 🔍 **Real-Time Search**
- 🔑 **Random Strong Password Generator**
- 🔓 **Forgot / Reset Password via Email**

---

## 🛠️ Getting Started

### ⚙️ Prerequisites

- **Node.js** – [Download](https://nodejs.org/)
- **MongoDB** – [Cloud (Atlas)](https://www.mongodb.com/cloud/atlas) or [Install Locally](https://www.mongodb.com/try/download/community)

---

### 📦 Installation

```bash
# 1. Clone the repository
git clone https://github.com/ayush-gupta456/pass_op.git
cd pass_op

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd backend
npm install
```

---

### 🔐 Environment Setup

Create a `.env` file inside the `backend/` directory:

```env
# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/passkeeper

# JWT Secret Key
JWT_SECRET=your-super-secret-jwt-key

# Email Config for Nodemailer (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
```

> 💡 **Use Gmail App Password**: If you have 2FA enabled, [create an App Password](https://support.google.com/accounts/answer/185833) to use with Nodemailer.

---

### 🚦 Run the Application

```bash
# From backend/ directory:
npm run dev         # Starts backend server (http://localhost:5000)

# From root (project/) directory:
npm run dev         # Starts frontend server (http://localhost:5173)

# OR run both concurrently (if configured)
npm run dev:full
```

---

## 📤 Deployment (Netlify + Render/MongoDB Atlas)

### 🌐 Frontend – Netlify

1. Push your frontend (Vite + React) code to GitHub  
2. Go to [Netlify](https://app.netlify.com/)  
3. Click **“Add New Site” → “Import from GitHub”**  
4. Set:
   - Build Command: `npm run build`  
   - Publish Directory: `dist/`  
5. Add a `_redirects` file inside the `public/` folder:

```txt
/*    /index.html   200
```

6. Deploy your site 🎉

---

### 🔙 Backend – Render

1. Visit [Render](https://render.com/)  
2. Click **"New Web Service"**  
3. Link your GitHub repo (select the `backend/` folder)  
4. Set the environment variables from `.env`  
5. Set **Start Command**:
   ```bash
   npm run dev
   ```
6. Choose a free tier for testing  
7. Make sure CORS is allowed for your frontend domain

---

## 📧 Email Integration

This project uses **Nodemailer** to send password reset emails using Gmail SMTP.

> 💬 Email credentials are secured via environment variables like `EMAIL_USER` and `EMAIL_PASSWORD`.

---

## 📸 Screenshots

📷 _Coming Soon..._ Showcase your app UI with screenshots.

---

## 🤝 Contributing

Contributions are welcome! 🙌

```bash
# 1. Fork the repo
# 2. Create a new branch
git checkout -b feature/myFeature

# 3. Commit your changes
git commit -m "✨ Added new feature"

# 4. Push and open a PR
```

---

## 👨‍💻 Author

**Ayush Gupta**  
📧 *[Email]*  
🔗 [GitHub](https://github.com/ayush-gupta456)
