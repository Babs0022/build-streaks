# Build Streaks - Farcaster Mini-App

A Farcaster mini-app built on Base that lets users start a "build streak," log daily progress, and track their streak count on-chain using ERC721 NFTs.

## Features

- 🎯 **Start Streak**: Mint a unique ERC721 NFT when starting your build streak
- 📝 **Daily Logging**: Log your daily progress with notes stored in Firebase
- 🔥 **Streak Tracking**: Track your consecutive build days on-chain
- 💎 **Base Network**: Built on Base for low-cost transactions
- 🎨 **Modern UI**: Beautiful, responsive interface with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Blockchain**: Solidity + Ethers.js + Wagmi
- **Database**: Firebase Firestore
- **Network**: Base (Ethereum L2)

## Project Structure

```
├── contracts/
│   └── streak.sol          # ERC721 smart contract
├── app/
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── providers.tsx       # Wagmi providers
├── components/
│   ├── Button.tsx          # Reusable button component
│   ├── StreakCard.tsx      # Main streak display card
│   └── LogModal.tsx        # Modal for logging progress
├── lib/
│   ├── ethers.ts           # Ethers.js utilities
│   ├── firebase.ts         # Firebase configuration
│   └── wagmi.ts            # Wagmi configuration
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
- WalletConnect project ID
- Private key for deployment

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

## Usage

1. **Connect Wallet**: Connect your wallet using MetaMask or WalletConnect
2. **Start Streak**: Click "Start Your Streak" to mint your streak NFT
3. **Log Daily**: Click "Log Today" to record your daily progress
4. **Track Progress**: View your streak count and last log day

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

### Smart Contract

The contract is deployed using Hardhat. Update the network configuration in `hardhat.config.js` as needed.

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For support, please open an issue on GitHub or contact the development team.
