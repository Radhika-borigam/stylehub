# 👑 StyleHub Frontend Client

[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg?style=flat&logo=react)](https://react.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC.svg?style=flat&logo=redux)](https://redux-toolkit.js.org/)
[![Material UI](https://img.shields.io/badge/Material_UI-6.x-007FFF.svg?style=flat&logo=mui)](https://mui.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC.svg?style=flat&logo=tailwindcss)](https://tailwindcss.com/)

Welcome to the **StyleHub Frontend Client**—a modern, dynamic, and responsive web application designed for a microservices-based salon booking and booking management ecosystem. StyleHub empowers users to book salon services, allows salon owners (partners) to manage their business operations, and provides administrators with a centralized control panel.

This client is fully integrated with a Spring Boot-based microservices backend via a centralized API Gateway, implementing transactional booking state machines, secure payment processing, and real-time WebSocket notifications.

---

## 🚀 Key Features

### 👤 Customer App
*   **Interactive Salon Discovery**: Search and filter salons by category, rating, location, and service availability.
*   **Multi-Service Selection Checkout**: Add multiple services to a booking cart with live cost calculations.
*   **Real-time Slot Booking**: Dynamic slot discovery showing booked vs. available slots for any date.
*   **Redirection Payment Handler**: Secure Razorpay integration. Handles redirection, transaction confirmations, and automated slot unlocking on payment cancellations/failures.
*   **Booking History**: Detailed ledger of previous and upcoming appointments with real-time status transitions (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`).
*   **Live WebSockets Notifications**: Instantly receive notifications regarding booking confirmations, cancellations, or updates without refreshing.

### ✂️ Salon Partner Dashboard
*   **Onboarding & Registration**: Integrated multi-step salon registration form with location and detail submissions.
*   **Service & Category Catalog**: Create, update, and categorize services (haircut, spa, makeup, etc.) with custom durations and pricing.
*   **Interactive Appointment Board**: Live grid displaying booking details, customer details, scheduled times, and appointment statuses.
*   **Real-Time Status Management**: Salon owners can update booking states (e.g. marking as `COMPLETED`).
*   **Recharts Financial Dashboard**: Visual reporting of sales, bookings count, and category distributions via custom-rendered area and bar charts.
*   **Transaction Logs**: Tracks payments, client list, and payout histories.

### 🛡️ Admin Dashboard
*   **Salon Moderation**: View pending partner applications, approve salons, and manage active salon states.
*   **Platform User Directory**: Oversee customer and salon owner directories.

---

## 🛠️ Technology Stack & Libraries

*   **Runtime & Build Engine**: [Vite](https://vitejs.dev/) - Super-fast hot module replacement (HMR) and optimized build bundling.
*   **Core UI Library**: [React 18](https://react.dev/) - Utilizing hooks, state, and virtual DOM.
*   **Global State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) (RTK) + `react-redux` - Centralized store, thunks for async API interactions, and clean reducers.
*   **Styling & Theme Engine**: [Material UI (v6)](https://mui.com/) + [Tailwind CSS](https://tailwindcss.com/) - Tailwind for utility spacing and layout grids; MUI for complex components (date-pickers, loaders, dialogs) utilizing a customized Violet-themed palette.
*   **Routing**: [React Router DOM (v7)](https://reactrouter.com/) - Declarative nested routing and role-based route segmentation.
*   **API Client**: [Axios](https://axios-http.com/) - With automated request interceptors for token attachment and response error mapping.
*   **Forms & Validation**: [Formik](https://formik.org/) & [Yup](https://github.com/jquense/yup) - Validation schemas and form state managers for login, signup, onboarding, and service addition.
*   **Real-time Synchronization**: [SockJS Client](https://github.com/sockjs/sockjs-client) & [Stompjs](https://github.com/stomp-js/stomp-websocket) - Persistent TCP-like connection to the WebSocket Message Broker.
*   **Visual Analytics**: [Recharts](https://recharts.org/) - Lightweight declarative chart libraries for admin and salon dashboards.

---

## 📂 Project Structure

The project follows a modular, feature-based directory structure:

```text
StyleHub_Frontend/
├── public/                 # Static assets
├── src/
│   ├── Admin/              # Admin pages (Dashboard, Salon approvals, lists)
│   ├── Auth/               # Authentication flow (Login, Register, Password resets)
│   ├── Customer/           # Customer flows (Home, Search, Bookings, Payment Success)
│   ├── salon/              # Partner flows (Onboarding, Seller Dashboard, Catalog)
│   ├── Redux/              # Redux Toolkit global store configurations
│   │   ├── Auth/           # Actions, reducers, and constants for Authentication
│   │   ├── Booking/        # Actions, reducers, and constants for Slots & Bookings
│   │   ├── Payment/        # Actions, reducers, and constants for Transactions
│   │   ├── Notifications/  # Real-time WebSocket notifications actions & state
│   │   └── store.js        # Configured Redux Toolkit store
│   ├── routes/             # Role-based route configurations (Customer, Salon, Admin)
│   ├── Theme/              # MUI Theme configuration (flipkartTheme.js)
│   ├── config/             # Global API and Axios config (api.js)
│   ├── util/               # Utility functions & custom hooks (useNotificationWebsoket)
│   ├── App.jsx             # Root layout and route controller
│   ├── index.css           # Global Tailwind utilities and base styles
│   └── index.jsx           # App entry point
├── package.json            # Configuration and script dependencies
├── vite.config.mjs         # Vite bundler configurations
└── tailwind.config.js      # Utility-first theme config overrides
```

---

## ⚡ Quick Start & Development

To run the StyleHub frontend client locally, follow these steps:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18.x or above) and `npm` installed.

### 2. Clone the Repository & Install Dependencies
```bash
# Clone the repository
git clone <repository-url>
cd StyleHub_Frontend

# Install all npm dependencies
npm install
```

### 3. Configure API Connection
Open `src/config/api.js` and configure the backend URL pointing to your running API Gateway (default is local port `8081`):

```javascript
const LOCALHOST = 'http://localhost:8081'; // Port of API Gateway
export const API_BASE_URL = LOCALHOST;
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### 5. Build for Production
```bash
# Compile and optimize assets
npm run build

# Preview production build locally
npm run preview
```

---

## 🔌 API Gateway & Request Interceptor

All HTTP calls are channeled through a configured Axios instance which handles automatic authentication injection. 

```javascript
// src/config/api.js
const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

*   **Security Header**: The bearer token is intercepted and added to the `Authorization` header on every state-mutating request.
*   **Authentication Expiry**: The client reads the `jwt` stored in `localStorage`. If absent or cleared, actions fall back to guest modes or redirect to `/login`.

---

## 🎨 Theme Configuration

The frontend UI uses a custom **Material UI Theme** mixed with Tailwind CSS classes to establish a premium look:

*   **Primary Palette**: Violet (`#7c3aed`) - used for focus elements, primary CTA buttons, and header items.
*   **Secondary Palette**: Rose (`#f43f5e`) - used for secondary CTAs, badges, and alerts.
*   **Backgrounds**: Soft Slate/Lavender (`#f8f6ff`) - giving a clean, modern feeling.
*   **Typography**: Google Fonts combination of `Inter`, `Outfit`, and `Roboto`.
