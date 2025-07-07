# 🔁 LoopIt - Local Item Swapping Platform

🌐 **Live App Preview**: https://loop-it.netlify.app/

LoopIt helps people in their community swap things they no longer need instead of throwing them away. Got a dress you never wear? Books collecting dust? A chair that doesn't fit anymore? Find someone nearby who wants it and see what they have to offer in return.

No money changes hands - just neighbors helping neighbors while keeping useful things out of landfills.

## What LoopIt Does

- **List items you want to swap** - clothes, books, furniture, electronics, whatever you have
- **Browse what's available nearby** - see what your neighbors are offering
- **Send swap requests** - propose trades and chat with other users
- **Track your environmental impact** - see how much waste you've prevented
- **Build trust in your community** - rate swaps and earn reputation badges

## For Developers

### Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with custom component library
- **State**: Zustand for app state management
- **Authentication**: JWT-based auth system
- **Images**: Cloudinary integration for photo uploads
- **Database**: MongoDB with comprehensive data models

### Getting Started

1. **Install dependencies**:

```bash
npm install
```

2. **Run development server**:

```bash
npm run dev
```

3. **Open** http://localhost:3000

### Project Structure

```
src/
├── app/                    # Next.js pages and routing
│   ├── dashboard/         # User dashboard
│   ├── item/              # Item detail pages
│   ├── profile-setup/     # User onboarding
│   ├── chat/              # Messaging between users
│   └── ...
├── components/            # React components
│   ├── item/              # Item listing and management
│   ├── chat/              # Real-time messaging
│   ├── profile/           # User profiles and settings
│   ├── environmental/     # Impact tracking
│   └── auth/              # Login and registration
├── data/                  # Sample data and mock APIs
├── store/                 # Zustand state management
├── tailwind/              # Reusable UI component library
│   ├── components/        # Core UI components
│   ├── styles/            # Design system utilities
│   └── types/             # TypeScript definitions
└── shared/types/          # App-wide TypeScript types
```

### Key Features

**Item Management**

- Upload photos and descriptions
- Set categories and condition
- Edit or delete your listings
- Track swap requests

**Community & Trust**

- User profiles with ratings
- Review system after swaps
- Trust badges and reputation scores
- In-app messaging

**Environmental Impact**

- Carbon footprint tracking
- Waste reduction metrics
- Eco-warrior badges
- Community leaderboards

**Local Focus**

- Location-based item discovery
- Neighborhood filtering
- Local community boards
- Event listings for swap meets

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Check code quality

### Demo Accounts

The app includes demo accounts for testing:

- **Admin**: `lamin.admin@loopit.gm` / `admin1234`
- **Regular users**: Various `@loopit.gm` emails / `demo1234`

### Design System

LoopIt uses a custom Tailwind-based design system with:

- Reusable UI components in `src/tailwind/components/`
- CSS variable-based theming
- Responsive design patterns
- Accessible form components

### State Management

The app uses Zustand for managing:

- User authentication and profiles
- Item listings and swap requests
- Chat conversations
- Environmental impact tracking
- Community features

Example:

```typescript
import { useLoopItStore } from "@/store";

function MyComponent() {
  const { user, items, createItem, sendSwapRequest } = useLoopItStore();
  // Use the store...
}
```

## The Vision

LoopIt isn't just about swapping stuff - it's about building communities where people look out for each other and the planet. Every swap keeps something useful in circulation instead of heading to a landfill.

We're starting local (focused on The Gambia) but the idea works anywhere people want to share resources and reduce waste.

## Contributing

This is an open-source community project. If you want to help make local sharing easier and more sustainable, we'd love your contributions.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.
