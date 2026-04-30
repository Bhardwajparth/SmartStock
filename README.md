# SmartStock: Centralized Inventory Management System

## Project Overview

SmartStock is a modern, responsive, and highly interactive React-based frontend application designed for centralized business operations and inventory management. The system is built to provide enterprise-level supply chain visualization, allowing users to track products, manage sales and purchase orders, handle complex manufacturing workflows, and generate real-time analytics. 

The primary goal of this application is to serve as a high-fidelity frontend prototype or a standalone, localized tool for small businesses. It features a stunning, rich aesthetic with smooth micro-animations, glassmorphism elements, and data visualization tools that create a premium user experience.

---

## Working Features

Currently, the application runs entirely on the client-side, utilizing React's Context API combined with browser `localStorage` for complete data persistence. This ensures that all CRUD (Create, Read, Update, Delete) operations are saved dynamically without needing a backend server.

### 1. Global State Management & Search
- **Data Persistence**: `inventory`, `orders`, and `manufacturingJobs` are saved in `localStorage`, persisting data across page reloads.
- **Global Search Engine**: A persistent top-bar search that dynamically filters data across the Inventory, Orders, and Manufacturing pages.

### 2. Interactive Dashboard (`/`)
- **Dynamic KPIs**: Calculates real-time metrics such as Total Products, Active Orders, and Low Stock Items.
- **Capacity Distribution**: Visualizes warehouse capacity usage using progress bars.
- **Data Visualization**: Integrates `Chart.js` to render a responsive "Sales Performance Trend" bar chart based on current sales orders.
- **Stock Criticality**: A dedicated section dynamically identifying products that have fallen below safety stock thresholds.

### 3. Inventory Management (`/inventory`)
- **Full CRUD Support**: Add new products, edit existing items, and safely delete them via confirmation dialogs.
- **Real-time Statuses**: Automatically categorizes products visually as "In Stock", "Low Stock", or "Out of stock".
- **Dynamic Filtering**: The list instantly responds to global search queries for fast SKU or product name lookups.

### 4. Order Logistics (`/orders`)
- **Sales & Purchase Workflow**: Create sales orders (outbound) or purchase orders (inbound).
- **Status Tracking**: Change order statuses dynamically (e.g., *Processing*, *In Transit*, *Completed*).
- **Stock Adjustments**: When an order's status changes to *Completed*, the system can trigger corresponding stock adjustments in the main inventory.
- **Interactive Data Table**: View recent activity and click into specific orders for a detailed side-panel view.

### 5. Manufacturing Workflow (`/manufacturing`)
- **Conversion Engine**: Simulates combining raw materials to produce finished goods.
- **Dynamic Yield Calculation**: Calculates an estimated percentage yield dynamically based on the input quantity requested.
- **Operations Log**: Tracks recent manufacturing runs, allowing users to update the status of the job (e.g., *In Progress* to *Completed*).

### 6. Analytics & Reports (`/reports`)
- **Automated Intelligence**: Calculates the Total Sales Value mathematically based on active order quantities and unit prices.
- **Velocity Tracking**: Determines the "Best Selling Item" and "Slowest Turnover" dynamically from historical order context.
- **Inventory Health Metrics**: Calculates the percentage of healthy stock vs. low stock and renders it into a visual CSS-based ring chart.

---

## Roadmap to a Production-Ready Frontend

While this frontend is fully functional as a local or demonstrative application, several architectural and feature enhancements are recommended to make it truly production-ready for an enterprise environment.

### 1. Backend API Integration
- **REST/GraphQL Integration**: Replace `localStorage` with a dedicated state-management data fetching library like **React Query** or **Redux Toolkit (RTK Query)**.
- **Database Connection**: Connect to a robust backend (Node.js, Django, Spring Boot) to manage concurrent users, locking, and massive datasets.

### 2. Authentication & Role-Based Access Control (RBAC)
- Add secure login flows using JWT or OAuth (e.g., Auth0, Firebase, NextAuth).
- Implement route guards to ensure only authorized users (e.g., Admins, Warehouse Managers) can access sensitive areas like Manufacturing or Financial Reports.

### 3. Advanced Data Handling
- **Server-Side Pagination & Infinite Scroll**: The current app relies on client-side array filtering. For thousands of SKUs, server-side pagination and sorting are required.
- **WebSockets / Server-Sent Events (SSE)**: Implement real-time updates so that if User A creates an order, User B sees the stock diminish instantly without refreshing.

### 4. Form Validation & Error Handling
- Integrate **React Hook Form** combined with **Zod** or **Yup** for rigorous schema validation before submitting data (e.g., preventing negative quantities, enforcing SKU formats).
- Add a global Toast Notification system (e.g., `react-toastify` or `sonner`) to provide immediate, non-intrusive feedback for successes and network errors.

### 5. Automated Testing CI/CD
- **Unit Testing**: Implement `Vitest` or `Jest` combined with React Testing Library for core utility functions and isolated component rendering.
- **End-to-End Testing**: Use `Playwright` or `Cypress` to simulate critical user flows (e.g., creating a product -> running it through manufacturing -> shipping it in an order).

### 6. Accessibility (a11y) & Internationalization (i18n)
- Audit and update components to meet WCAG standards (ARIA labels, keyboard navigation focus trapping for modals).
- Prepare the application for multiple regions by integrating `react-i18next` for translations and localized currency/date formatting.
