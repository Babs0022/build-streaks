import { ethers } from 'ethers';

// Contract ABI - this would be generated from the compiled contract
export const STREAK_CONTRACT_ABI = [
  "function startStreak() public returns (uint256)",
  "function logDay() public returns (uint256)",
  "function getStreak(address user) public view returns (uint256)",
  "function getTokenId(address user) public view returns (uint256)",
  "function getLastLogDay(address user) public view returns (uint256)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "event StreakStarted(address indexed user, uint256 tokenId)",
  "event DayLogged(address indexed user, uint256 tokenId, uint256 newStreakCount)"
];

// Base mainnet contract address (update after deployment)
export const STREAK_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_STREAK_CONTRACT_ADDRESS || '';

export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return new ethers.JsonRpcProvider('https://mainnet.base.org');
};

export const getContract = (provider: ethers.Provider) => {
  return new ethers.Contract(STREAK_CONTRACT_ADDRESS, STREAK_CONTRACT_ABI, provider);
};

export const getSigner = async (provider: ethers.BrowserProvider) => {
  return await provider.getSigner();
};

// Add window.ethereum type declaration
declare global {
  interface Window {
    ethereum?: any;
  }
}
