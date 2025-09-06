# Build Streaks - Base Mini App

A Base Mini App that lets users start a "build streak," log daily progress, and track their streak count on-chain using ERC721 NFTs.

## Features

- 🎯 **Start Streak**: Mint a unique ERC721 NFT when starting your build streak
- 📝 **Daily Logging**: Log your daily progress with notes stored in Firebase
- 🔥 **Streak Tracking**: Track your consecutive build days on-chain
- 💎 **Base Network**: Built on Base for low-cost transactions
- 🎨 **Modern UI**: Beautiful, responsive interface optimized for Base Mini Apps
- 👥 **Social Integration**: Built-in social features through Base App

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Blockchain**: Solidity + Base App integration
- **Database**: Firebase Firestore
- **Platform**: Base Mini Apps

## Base Mini App Architecture

This app follows the [Base Mini Apps guidelines](https://docs.base.org/mini-apps/overview) and leverages:

- **Built-in Social Infrastructure**: User identity, authentication, and social connections
- **Viral Distribution**: Organic sharing through Base App social feeds
- **Frictionless Experience**: No downloads, instant engagement
- **Base App Integration**: Native wallet and transaction handling

## Project Structure

```
├── contracts/
│   └── streak.sol          # ERC721 smart contract
├── app/
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main Mini App page
│   └── api/
│       └── og/route.ts     # OpenGraph image generation
├── components/
│   ├── Button.tsx          # Reusable button component
│   ├── StreakCard.tsx      # Main streak display card
│   └── LogModal.tsx        # Modal for logging progress
├── lib/
│   ├── base-app.ts         # Base App integration utilities
│   └── firebase.ts         # Firebase configuration
├── public/
│   └── .well-known/
│       └── farcaster.json  # Mini App manifest
└── scripts/
    └── deploy.js           # Contract deployment script
```

## Smart Contract

The `BuildStreak` contract is an ERC721 NFT that tracks user streaks:

- `startStreak()`: Mints a new streak NFT for the caller
- `logDay()`: Logs a day and updates the streak counter
- `getStreak(address)`: Returns the streak count for a user
- `getLastLogDay(address)`: Returns the timestamp of the last log day

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy `env.example` to `.env.local` and fill in your configuration:

```bash
cp env.example .env.local
```

Required environment variables:
- Firebase configuration
- Contract address (after deployment)

### 3. Deploy Smart Contract

```bash
# Compile contracts
npx hardhat compile

# Deploy to Base Sepolia (testnet)
npx hardhat run scripts/deploy.js --network baseSepolia

# Deploy to Base (mainnet)
npx hardhat run scripts/deploy.js --network base
```

### 4. Update Contract Address

After deployment, update `NEXT_PUBLIC_STREAK_CONTRACT_ADDRESS` in your `.env.local` file.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Base Mini App Integration

### Manifest File

The app includes a `farcaster.json` manifest file at `/.well-known/farcaster.json` that defines:

- App metadata (name, description, icon)
- Permissions (user, wallet access)
- Features (NFT minting, daily logging)
- Category and tags for discovery

### Base App Context

The app integrates with Base App's built-in features:

- **User Identity**: Access to user profile, username, and avatar
- **Wallet Integration**: Native wallet connection and transaction handling
- **Social Features**: Built-in sharing and social graph access

### Usage Flow

1. **Discovery**: Users find the app through Base App search or social feeds
2. **Instant Launch**: App opens immediately without installation
3. **Authentication**: Automatic user authentication through Base App
4. **Interaction**: Users can start streaks, log progress, and view history
5. **Sharing**: Built-in social sharing through Base App

## Firebase Setup

1. Create a Firebase project
2. Enable Firestore database
3. Set up security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /dailyLogs/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. Add your Firebase config to `.env.local`

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Base Mini App

1. Deploy your app to a public URL
2. The app will be automatically indexed by Base App
3. Users can discover it through search and social feeds

## Base Mini App Benefits

- **No App Store**: Deploy directly without approval processes
- **Viral Distribution**: Every interaction becomes potential sharing
- **Social Native**: Built-in friend networks and social context
- **Frictionless**: No downloads, instant engagement
- **Cross-Platform**: Works on all devices through Base App

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For support, please open an issue on GitHub or contact the development team.