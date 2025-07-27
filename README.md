# Sweet Shop

A full-stack web application for managing and purchasing sweets. This project features a modern React frontend and a Node.js/Express backend with a MongoDB database (mocked for testing). It supports user authentication, admin management, product search, and more.

## Features

- User registration and login (JWT-based authentication)
- Admin dashboard for managing sweets (add, edit, delete, restock)
- Customer view for browsing and purchasing sweets
- Product search and filtering
- Responsive, animated UI with Tailwind CSS and Framer Motion
- Comprehensive backend API with robust validation and error handling
- Full Jest test suite for backend endpoints

## Project Structure

```
root/
├── backend/
│   ├── api/                # API route handlers
│   ├── controllers/        # Business logic
│   ├── models/             # Mongoose models
│   ├── tests/              # Jest test suites
│   ├── utils/              # Utility modules (e.g., db.js)
│   ├── package.json        # Backend dependencies
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── contexts/       # React context providers
│   │   └── App.jsx         # Main app entry
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies
│   └── ...
├── README.md               # Project documentation
└── ...
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Backend Setup
1. `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file (see `.env.example` if available)
4. Run the server: `npm start` or `npm run dev`
5. Run tests: `npm test`

### Frontend Setup
1. `cd frontend`
2. Install dependencies: `npm install`
3. Start the dev server: `npm start`

### Deployment
- For static hosting (Vercel, Netlify, etc.), ensure all routes fallback to `index.html` for client-side routing.
- See `vercel.json` or `_redirects` for configuration examples.

## API Endpoints (Backend)

### Health
- `GET /api/health` - Health check

### Authentication
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT

### Sweets
- `POST /api/sweets` — Add a new sweet (admin only)
- `GET /api/sweets` — List all sweets
- `GET /api/sweets/search` — Search sweets by name, category, price, etc.
- `PUT /api/sweets/:id` — Edit sweet details (admin only)
- `DELETE /api/sweets/:id` — Delete a sweet (admin only)
- `POST /api/sweets/:id/purchase` — Purchase a sweet
- `POST /api/sweets/:id/restock` — Restock a sweet (admin only)

## My AI Usage

### Which AI tools I used
- **GitHub Copilot**
- **ChatGPT**

### How I used them
- I used **GitHub Copilot** for in-editor code suggestions, boilerplate generation, and to quickly scaffold React components, Express route handlers, and validation logic.
- For some UI/UX improvements, I asked Copilot to suggest Tailwind CSS classes and Framer Motion animation patterns.
- I also used Copilot to generate and refactor Jest test cases for backend endpoints, ensuring alignment with the implemented API logic.

### Reflection on AI impact
AI tools significantly accelerated my workflow, especially for repetitive or boilerplate-heavy tasks. Copilot's inline suggestions helped me avoid context switching and kept me productive in the editor. AI made the correction part easy enough so even if I was suck at place, I could quickly get a solution and understand where I was going wrong. Overall, AI made the development process faster, more efficient, and less error-prone, but human oversight remained essential for quality and alignment with project goals.