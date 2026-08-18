# SmartWallet

Personal finance application to track expenses and budgets with an intuitive UI and powerful analytics.

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Data visualization library
- **Axios** - HTTP client for API requests

### Backend
- **Express.js** - Web framework
- **Node.js** - JavaScript runtime
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Tools
- **ESLint** - Code quality and style enforcement
- **Prettier** - Code formatter
- **Vitest** - Testing framework

## Project Structure

```
SmartWallet/
├── frontend/                    # React + Vite application
│   ├── public/                 # Static assets
│   └── src/
│       ├── components/         # Reusable UI components
│       ├── pages/              # Route-mapped view components
│       ├── services/           # API request modules (Axios)
│       ├── charts/             # Chart.js configuration
│       ├── context/            # Global state management
│       ├── hooks/              # Custom React hooks
│       ├── utils/              # Helper functions and utilities
│       ├── styles/             # Global and Tailwind styles
│       └── App.jsx             # Root component
├── backend/                     # Express.js server
│   ├── config/                 # Environment and database config
│   ├── data/                   # JSON data files
│   ├── routes/                 # API endpoint definitions
│   ├── controllers/            # Business logic and handlers
│   ├── models/                 # Data schemas and parsing
│   ├── middleware/             # Auth, logging, error handlers
│   ├── services/               # Business logic services
│   └── utils/                  # Server utilities
├── docs/                        # Project documentation
├── testing/                     # Integration and unit tests
├── .gitignore                  # Git ignore patterns
├── .eslintrc.json              # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── package.json                # Root package with workspaces
└── README.md                   # This file
```

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd SmartWallet
```

2. Install dependencies
```bash
npm install
```

This installs dependencies for the root, frontend, and backend simultaneously using npm workspaces.

## Development

### Running Development Servers

Start both frontend and backend development servers:
```bash
npm run dev
```

- **Frontend** runs on `http://localhost:5173` (Vite default)
- **Backend** runs on `http://localhost:3000` (configure in backend)

### Code Quality

Format code with Prettier:
```bash
npm run format
npm run format:check  # Check without formatting
```

Lint code with ESLint:
```bash
npm run lint
npm run lint:fix     # Auto-fix issues
```

## Building for Production

Build both frontend and backend:
```bash
npm run build
```

## Testing

Run tests across all workspaces:
```bash
npm run test
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend and backend dev servers |
| `npm run build` | Build frontend and backend for production |
| `npm run test` | Run test suites |
| `npm run lint` | Check code quality with ESLint |
| `npm run lint:fix` | Automatically fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting without changes |

## Development Workflow

1. Create a feature branch from `main`
2. Make your changes in frontend or backend
3. Run linting and formatting: `npm run lint:fix && npm run format`
4. Test your changes: `npm run test`
5. Commit with clear messages
6. Push and create a pull request

## Environment Variables

Create a `.env` file in the backend directory:
```
NODE_ENV=development
PORT=3000
```

## Contributing

- Follow the existing code structure and naming conventions
- Use meaningful commit messages
- Ensure code passes linting and formatting checks before committing
- Write tests for new features
- Update documentation as needed

## License

MIT
