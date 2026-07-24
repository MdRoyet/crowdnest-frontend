# CrowdNest Frontend

A modern crowdfunding platform built with Next.js 16, React 19, and TypeScript. CrowdNest empowers creators to launch campaigns and supporters to back projects they believe in.

## Features

### Public Pages
- **Hero Slider** - Dynamic landing page with featured campaigns
- **Featured Campaigns** - Showcase of trending and top campaigns
- **Testimonials** - Community feedback and success stories
- **Campaign Details** - Detailed campaign pages with contribution options
- **Explore Campaigns** - Browse and discover active campaigns

### Role-Based Dashboards

#### Admin Dashboard
- **Manage Users** - View and manage platform users
- **Manage Campaigns** - Oversee all campaigns
- **Campaign Approvals** - Review and approve campaign submissions
- **Withdrawal Requests** - Process creator withdrawal requests
- **Reports** - Platform analytics and reporting

#### Creator Dashboard
- **Add Campaign** - Create new fundraising campaigns
- **My Campaigns** - Manage your active and past campaigns
- **Payment History** - Track received contributions
- **Withdrawals** - Request fund withdrawals

#### Supporter Dashboard
- **Explore Campaigns** - Discover campaigns to support
- **My Contributions** - Track your backing history
- **Payment History** - View your contribution history
- **Purchase Credits** - Buy platform credits for contributions

### Authentication
- Email/Password registration and login
- Google OAuth via Firebase Authentication
- Role-based access control (Admin, Creator, Supporter)
- HTTP-only cookie session management

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Design System | Astryx Design (150+ components) |
| Authentication | Firebase Auth |
| State Management | React Context |
| Form Validation | Zod |
| Animations | TwAnimate CSS |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Backend API running at `http://localhost:5000/api`

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/crowdnest-frontend.git

# Navigate to project directory
cd crowdnest-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file with the following variables:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Development

```bash
# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

### Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
crowdnest-frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Auth routes (login, register)
│   │   ├── (main)/          # Public pages
│   │   │   ├── campaign-details/
│   │   │   ├── explore-campaigns/
│   │   │   └── page.tsx     # Homepage
│   │   └── dashboard/       # Role-based dashboards
│   │       ├── admin/
│   │       ├── creator/
│   │       └── supporter/
│   ├── components/
│   │   ├── auth/            # Auth-related components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── home/            # Homepage components
│   │   ├── shared/          # Shared components
│   │   └── ui/              # UI primitives
│   ├── context/             # React Context providers
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and API client
│   ├── middleware.ts        # Next.js middleware
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
├── components.json          # shadcn/ui configuration
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## API Integration

The frontend communicates with a REST API backend:

```typescript
import api from '@/lib/api';

// GET request
const campaigns = await api.get<Campaign[]>('/campaigns');

// POST request
const newCampaign = await api.post<Campaign>('/campaigns', campaignData);

// PUT request
const updated = await api.put<Campaign>('/campaigns/123', data);

// DELETE request
await api.delete('/campaigns/123');
```

## Design System

This project uses [Astryx Design](https://astryx.design) with 150+ components. Key principles:

- Use components instead of raw HTML elements
- Leverage design tokens for consistent theming
- Follow the layout system for page structure

### Useful Commands

```bash
# Discover components for a feature
npx astryx build "campaign card"

# Get component documentation
npx astryx component Button

# List all available components
npx astryx component --list

# Browse templates
npx astryx template --list
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For support, email support@crowdnest.com or open an issue in the repository.
