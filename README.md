# Business Manager

A professional business management dashboard for managing products, sales, customers, debts, expenses, reports, and business settings.

## Project Overview

Business Manager is a responsive React and Vite application for small-business operations. It provides authenticated users with a central workspace for tracking inventory, recording transactions, monitoring customer balances, reviewing expenses, and understanding business performance.

The application uses Supabase for authentication and persistent, user-scoped application data.

## Features

- Secure authentication with sign in, sign up, password reset, and password update flows
- Dashboard analytics for sales, expenses, profit, debt, customers, and inventory
- Product and inventory management with stock levels and low-stock indicators
- Sales and transaction management with payment status and automatic stock reduction
- Customer management with search, add, edit, and delete workflows
- Debt tracking and payment recording with remaining-balance calculations
- Expense tracking with categories, dates, search, and filters
- Reports and business analytics
- Business profile and settings management
- Search and filters across supported modules
- Responsive design for desktop, tablet, and mobile layouts
- Supabase persistence across browser refreshes
- User-scoped data protected by Supabase Row Level Security

## Tech Stack

- React 19
- Vite 8
- JavaScript and JSX
- CSS
- Supabase JavaScript client
- Supabase Authentication and Postgres
- Oxlint

No charting library is currently used. Report visual indicators are implemented with the existing application UI and CSS.

## Application Modules

### Dashboard

Provides a business overview with financial metrics, recent sales activity, low-stock products, and inventory summaries.

### Products

Manages product names, categories, prices, stock quantities, search, and low-stock visibility.

### Sales

Records customer purchases, calculates sale amounts from product price and quantity, tracks paid or pending status, and reduces product stock automatically.

### Customers

Maintains customer names, phone numbers, and addresses with search, add, edit, and delete functionality.

### Debts

Tracks customer debt records, paid amounts, remaining balances, payment status, and additional payments.

### Expenses

Records business expenses by name, category, amount, and date. Supported categories are Rent, Transport, Utilities, Supplies, Salary, and Other.

### Reports

Summarizes financial performance, sales status, expenses by category, debt balances, customers, products, inventory value, and low-stock products.

### Settings

Stores and displays the business name, owner or manager name, phone number, email address, and business address.

## Authentication

Authentication is handled by Supabase Auth. The application:

- Checks the current session before displaying the authenticated application
- Supports email/password sign in
- Supports account creation
- Supports password reset email requests
- Supports password updates after recovery
- Supports signing out

Users do not see the main application shell until the initial session check has completed.

## Database / Supabase

The application uses these six main public tables:

- **products** — product catalogue, prices, and stock quantities
- **customers** — customer contact and address information
- **sales** — recorded sales, amounts, products, customers, and payment status
- **debts** — customer debt totals, paid amounts, and remaining balances
- **expenses** — expense names, categories, amounts, and dates
- **business_settings** — one business profile record per authenticated user

The frontend loads records through the existing Supabase client and uses the authenticated user's ID for user-scoped reads, updates, and deletes. Inserts rely on the database's ownership handling rather than manually supplying user_id.

## Security / Row Level Security

The project is designed around Supabase's security model:

- Supabase Authentication identifies the current user.
- Row Level Security policies isolate records by authenticated user.
- Frontend queries scope reads and mutations to the current user's records where appropriate.
- The frontend uses only the public/publishable Supabase key.
- A service_role key is not exposed in the frontend.
- .env.local is ignored and must never be committed.

Database policies and schema are managed in Supabase rather than in this repository. Keep the verified RLS policies enabled when deploying.

## Screenshots

Screenshots can be added here for portfolio presentation when available:

- Dashboard — screenshot placeholder
- Products — screenshot placeholder
- Sales — screenshot placeholder
- Customers — screenshot placeholder
- Debts — screenshot placeholder
- Expenses — screenshot placeholder
- Reports — screenshot placeholder
- Settings — screenshot placeholder

No screenshot URLs or images are claimed by this repository yet.

## Getting Started

### Prerequisites

- Node.js with npm
- A Supabase project configured with the application's tables, authentication, and RLS policies

### Install

```bash
npm install
```

Create a local environment file named .env.local:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Use the values from your Supabase project. Do not place real credentials or secrets in this README or in committed source files.

## Environment Variables

The Vite client expects:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

These are client-side publishable configuration values. Never put a Supabase service_role key, database password, or other server secret in frontend environment variables.

## Local Development

Start the Vite development server:

```bash
npm run dev
```

Run the project checks:

```bash
npm run lint
npm run build
```

The development server will print the local URL in the terminal.

## Build for Production

Create the production bundle with:

```bash
npm run build
```

The generated static files are written to dist/. The dist/ directory is ignored by Git and can be served by a static hosting provider.

You can preview the production build locally with:

```bash
npm run preview
```

## Deployment

This Vite application is suitable for static hosting platforms such as Vercel or Netlify.

General deployment configuration:

- Build command: npm run build
- Output directory: dist
- Node.js environment: use a current supported Node.js version
- Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY as hosting-provider environment variables
- Keep Supabase Authentication redirect URLs and site URL configured for the deployed domain
- Keep the existing Supabase RLS policies enabled

Deployment has not been performed automatically. Before going live, test authentication, database access, refresh persistence, and the deployed domain's Supabase redirect configuration.

## Project Structure

```text
.
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── lib/
│   │   └── supabaseClient.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.local
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── vite.config.js
└── README.md
```

.env.local is a local-only file and should remain untracked. node_modules/ and dist/ are also ignored.

## Future Improvements

The following are ideas for future iterations, not completed features:

- PDF invoices and receipt generation
- Export to CSV or Excel
- Advanced analytics and trend reporting
- Notifications for low stock, debts, or pending payments
- Multi-business support
- Role-based staff accounts and permissions
- Audit history for business changes
- Automated backups and data exports

## Author

Maliyah Jr

- GitHub: [Add GitHub profile]
- Portfolio: [Add portfolio link]
