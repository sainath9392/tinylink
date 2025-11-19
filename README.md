# 🔗 TinyLink --- URL Shortener

TinyLink is a modern, full-stack URL shortener built with **Next.js**,
**Tailwind CSS**, and **PostgreSQL (Neon)**. It allows users to shorten
long URLs, create custom aliases, and track click analytics in
real-time.

## 🚀 Features

### **Core Functionality**

-   **Shorten Links:** Convert long URLs into short, shareable links.
-   **Custom Aliases:** Users can choose their own custom short codes
    (e.g., `tinylink/mydocs`).
-   **Smart Redirects:** Visiting a short link (e.g., `/abc123`)
    performs a **302 redirect** to the original URL.
-   **Analytics:** Tracks total clicks and the **last clicked
    timestamp** for every link.

### **User Interface & UX**

-   **Modern Dashboard:** Clean, responsive UI with Tailwind CSS +
    subtle glass effects.
-   **Live Updates:** Click counts update automatically (polling) --- no
    page refresh required.
-   **Invisible Auth:** Uses browser tokens for link ownership --- no
    login screen needed.
-   **Search & Filter:** Filter links by URL or sort by *Newest* vs
    *Most Clicks*.
-   **Mobile Responsive:** Fully optimized for desktop, tablet, and
    mobile.

### **API & Architecture**

-   **Health Check:** `/healthz` endpoint for uptime monitoring.
-   **RESTful API:** Endpoints for creating, reading, analytics, and
    deleting links.
-   **PostgreSQL:** Persistent storage via **Prisma ORM** and **Neon
    database**.

## 🛠️ Tech Stack

-   **Framework:** Next.js 14+ (App Router)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **Database:** PostgreSQL (Neon)
-   **ORM:** Prisma
-   **Icons:** Lucide React
-   **Deployment:** Vercel

## 📦 Installation & Setup

### **1. Clone the Repository**

``` bash
git clone https://github.com/YOUR_USERNAME/tinylink.git
cd tinylink
```

### **2. Install Dependencies**

``` bash
npm install
```

### **3. Environment Setup**

Create a `.env` file in the root directory:

``` env
DATABASE_URL="postgres://user:password@host/database?sslmode=require"
```

### **4. Setup Database**

``` bash
npx prisma db push
```

### **5. Run Development Server**

``` bash
npm run dev
```

Open **http://localhost:3000** to view the app.

## 🧪 API Endpoints

  -----------------------------------------------------------------------------
  Method   Endpoint             Description
  -------- -------------------- -----------------------------------------------
  GET      `/healthz`           Returns `{ "ok": true, "version": "1.0" }`

  GET      `/api/links`         List all links belonging to the current user

  POST     `/api/links`         Create a new link (supports custom short codes)

  GET      `/api/links/:code`   Fetch analytics for one short link

  DELETE   `/api/links/:code`   Delete a short link

  GET      `/:code`             Redirects to the original URL (302 Redirect)
  -----------------------------------------------------------------------------

## 📂 Project Structure

    src/
    ├── app/
    │   ├── [code]/          # Redirect logic (GET /:code)
    │   ├── api/             # Backend API routes
    │   ├── code/            # Analytics page UI
    │   ├── healthz/         # Health check endpoint
    │   ├── globals.css      # Tailwind & Custom Animations
    │   ├── layout.tsx       # Root layout
    │   └── page.tsx         # Main Dashboard UI
    └── lib/
        └── prisma.ts        # Database client helper

## 📝 License

This project is open-source and available under the **MIT License**.
