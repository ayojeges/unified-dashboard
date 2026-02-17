# Unified Dashboard

A modern, feature-rich dashboard application built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Authentication System** - Secure login and registration with form validation
- **Dashboard Overview** - Comprehensive stats and recent activity tracking
- **Project Management** - Create, track, and manage projects with progress monitoring
- **Kanban Board** - Drag-and-drop task management with visual workflow
- **Audio Recorder** - Record, transcribe, and manage audio notes with speech-to-text
- **Analytics Dashboard** - Interactive charts and performance metrics
- **Team Calendar** - Schedule and manage meetings and events
- **Real-time Chat** - Team communication with online status indicators
- **Settings Panel** - Customizable user preferences and security settings

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + custom components
- **Charts**: Recharts
- **Authentication**: NextAuth.js (ready for integration)
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ayojeges/unified-dashboard.git
cd unified-dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
unified-dashboard/
├── app/
│   ├── auth/              # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/         # Main dashboard
│   ├── projects/          # Project management
│   ├── audio/             # Audio recording
│   ├── analytics/         # Analytics dashboard
│   ├── calendar/          # Team calendar
│   ├── chat/              # Real-time chat
│   └── settings/          # User settings
├── components/
│   ├── ui/               # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── kanban/           # Kanban board
│   ├── audio-input/      # Audio recorder
│   └── analytics/        # Analytics charts
├── lib/                  # Utility functions
└── public/               # Static assets
```

## Features in Detail

### Authentication
- Secure login and registration forms
- Form validation with error handling
- Responsive design for all devices

### Dashboard
- Real-time statistics and metrics
- Recent activity feed
- Quick action buttons
- Responsive grid layout

### Project Management
- Project cards with progress tracking
- Team member assignment
- Task count and completion status
- Filtering and search functionality

### Kanban Board
- Drag-and-drop task management
- Multiple status columns (To Do, In Progress, Review, Done)
- Task prioritization
- Real-time updates

### Audio Recorder
- Browser-based audio recording
- Simulated speech-to-text transcription
- Audio playback with controls
- Cloud storage simulation

### Analytics
- Interactive charts (Line, Bar, Pie)
- Team performance metrics
- Task status distribution
- Automated insights

### Calendar
- Monthly/weekly views
- Event scheduling
- Meeting details and locations
- Quick event creation

### Team Chat
- Real-time messaging interface
- Online status indicators
- File attachment support
- Group and direct messaging

### Settings
- User profile management
- Notification preferences
- Security settings (2FA, password)
- Appearance customization

## Deployment

The application is ready for deployment on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ayojeges/unified-dashboard)

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Authentication (example - configure based on your auth provider)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Database (example - configure based on your database)
DATABASE_URL=your-database-url
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Charts from [Recharts](https://recharts.org/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)