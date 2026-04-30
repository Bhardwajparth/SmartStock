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

