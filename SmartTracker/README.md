# User List Management System

A comprehensive user list table with search, filter, and pagination features built with React, Express.js, and TypeScript.

## Features

- **Real-time Search**: Debounced search functionality across user names, emails, and roles
- **Advanced Filtering**: Filter users by status (Active, Inactive, Pending) and role (Admin, User, Moderator, Editor)
- **Pagination**: Navigate through large datasets with customizable page sizes (10, 25, 50, 100)
- **User Selection**: Select individual users or bulk select with action capabilities
- **Responsive Design**: Modern UI that works on desktop and mobile devices
- **Active Filter Display**: Visual indicators showing currently applied filters

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Wouter (routing)
- **Backend**: Express.js, TypeScript
- **UI Components**: Radix UI (via shadcn/ui)
- **State Management**: TanStack Query (React Query)
- **Data Storage**: In-memory storage with sample data

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd user-list-management
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and query client
│   │   ├── pages/          # Page components
│   │   └── main.tsx        # Application entry point
│   └── index.html
├── server/                 # Backend Express server
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Data storage layer
│   └── vite.ts             # Vite integration
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Data models and validation
└── package.json
```

## API Endpoints

- `GET /api/users` - Get users with optional search, filter, and pagination
- `GET /api/users/:id` - Get a specific user
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### Query Parameters for GET /api/users

- `search` - Search term for name, email, or role
- `status` - Filter by status (active, inactive, pending)
- `role` - Filter by role (admin, user, moderator, editor)
- `page` - Page number (default: 1)
- `pageSize` - Number of items per page (default: 10, max: 100)

## Sample Data

The application includes 12 sample users with various roles and statuses for demonstration purposes.

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Style

- TypeScript for type safety
- ESLint and Prettier for code formatting
- Tailwind CSS for styling
- Component-based architecture

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.