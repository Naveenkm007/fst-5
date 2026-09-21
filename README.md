# NHCE CSE Leave Hub

A modern, frontend-only leave management dashboard for the Computer Science and Engineering department at **New Horizon College of Engineering**.

Built for student leave requests and class teacher approvals, with a focused dashboard for balances, events, timers, and attendance-friendly review workflows.

**Live app:** [5-seven-mocha.vercel.app](https://5-seven-mocha.vercel.app)

## What it includes

### Student workspace

- Casual leave and medical leave balances
- Leave cycle countdown with a live timer
- September leave calendar with marked leave days
- Apply-for-leave form with date range and reason
- Automatic day calculation from selected dates
- Request history with pending, approved, and rejected states
- Live event feed after submitting or reviewing a request

### Teacher admin workspace

- Dedicated teacher approval panel for the CSE department
- Pending request queue with student register number and reason
- Approve or reject leave requests in one click
- Summary cards for pending, total, and approved requests
- Immediate status and event updates across the dashboard
- Responsive layout for desktop and mobile screens

## Technology

- React 19
- Vite
- JavaScript
- CSS
- Oxlint
- Vercel deployment

No backend or database is required. The current prototype stores data in React state for frontend demonstration and interaction testing.

## Getting started

### Requirements

- Node.js 18 or newer
- npm

### Install and run

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint checks |

## Project structure

```text
src/
├── App.jsx       # Leave dashboard, student flow, and teacher admin flow
├── App.css       # Dashboard layout and responsive UI styles
├── index.css     # Global design tokens and page reset
└── main.jsx      # React entry point
public/
└── icons.svg     # Shared public icon sprite
```

## Demo identity

- **Student:** Naveen Kumar KM
- **Register number:** 1NH24CS409
- **Department:** CSE
- **Teacher:** Dr. R. Meenakshi

## Deployment

The project is configured for Vercel and is connected to the GitHub repository. To deploy from a local machine:

```bash
npx vercel --prod
```

For a Git-based workflow, push to the `main` branch and Vercel will build the Vite project using the default `vite build` command and publish the `dist` output.

## Important note

This is a frontend prototype. Requests, balances, and approvals are held in browser memory and reset when the page reloads. A production version would connect these flows to authentication, a database, and department-level access controls.
