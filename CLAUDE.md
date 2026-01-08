# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React-based to-do list application with email-based user identification, deployed on Azure Static Web Apps. The frontend is built with React + Vite + Tailwind CSS, and the backend uses Azure Functions with Azure Table Storage for persistence.

## Development Commands

### Frontend
```bash
npm run dev       # Start Vite dev server at http://localhost:5173
npm run build     # Build for production (outputs to dist/)
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

### Backend (Azure Functions)
```bash
cd api
npm install       # Install dependencies
func start        # Start Azure Functions locally (requires Azure Functions Core Tools)
```

Note: The API folder uses CommonJS (`type: "commonjs"`) while the root uses ES modules.

## Architecture

### Frontend Structure
- **[src/App.jsx](src/App.jsx)**: Main application component that manages:
  - Email-based authentication (via localStorage + prompt)
  - Todo state and CRUD operations
  - API communication with Azure Functions backend
- **[src/components/](src/components/)**: UI components
  - `Header.jsx`: Displays user email
  - `TodoInput.jsx`: Input form for adding todos
  - `TodoList.jsx`: Container for todo items
  - `TodoItem.jsx`: Individual todo item with toggle/delete
  - `UsernameModal.jsx`: Email prompt modal

### Backend Structure
- **[api/todos/index.js](api/todos/index.js)**: Single Azure Function handling all todo operations
  - HTTP trigger with route: `/api/todos/{id?}`
  - Methods: GET (fetch), POST (create/update), DELETE (remove)
  - Uses Azure Table Storage with email as `PartitionKey` and todo ID as `RowKey`
  - Requires `AZURE_STORAGE_CONNECTION_STRING` environment variable

### Authentication Model
- Email-based identity (no OAuth)
- Email stored in localStorage as `userEmail`
- All API requests require email parameter (query or body)
- Each user's todos are partitioned by their email in Table Storage

### Key Implementation Details

1. **Crypto Polyfill**: [api/todos/index.js:1-3](api/todos/index.js#L1-L3) adds a crypto polyfill for Azure Functions runtime compatibility

2. **State Management**: App.jsx uses React hooks for local state. No Redux or global state library.

3. **Data Flow**:
   - User provides email on first visit
   - App fetches todos via GET `/api/todos?email=...`
   - Add/update uses POST `/api/todos` with todo object
   - Delete uses DELETE `/api/todos` with id and email

4. **Styling**: Tailwind CSS utility classes throughout components

## Deployment

CI/CD via GitHub Actions ([.github/workflows/azure-static-web-apps-icy-island-0357a9410.yml](.github/workflows/azure-static-web-apps-icy-island-0357a9410.yml)):
- Triggers on push/PR to main branch
- Builds frontend (Vite) and backend (Azure Functions)
- Deploys to Azure Static Web Apps
- Build output: `dist/` directory
- API location: `api/` directory

## Environment Variables

**Production** (set in Azure Static Web Apps):
- `AZURE_STORAGE_CONNECTION_STRING`: Connection string for Azure Table Storage

**Local Development** (api/local.settings.json):
- `AZURE_STORAGE_CONNECTION_STRING`: Add this manually for local testing
- `AzureWebJobsStorage`: Set to "UseDevelopmentStorage=true"
- `FUNCTIONS_WORKER_RUNTIME`: "node"

## Important Notes

- The backend requires Node.js ≥18 ([api/package.json:5-7](api/package.json#L5-L7))
- Email is the sole identifier; no password or traditional auth
- Todos are NOT deleted when users clear localStorage (only client-side email is lost)
- The Azure Function creates the `todos` table automatically if it doesn't exist
