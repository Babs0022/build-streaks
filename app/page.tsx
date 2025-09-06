'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { StreakCard } from '@/components/StreakCard';
import { LogModal } from '@/components/LogModal';
import { getProvider, getContract, getSigner } from '@/lib/ethers';
import { addDailyLog, getTodayLog, DailyLog } from '@/lib/firebase';
import { Flame, Zap, Trophy } from 'lucide-react';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  
  const [streakCount, setStreakCount] = useState(0);
  const [lastLogDay, setLastLogDay] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user's streak data
  const loadStreakData = async () => {
    if (!address) return;
    
    try {
      setIsLoading(true);
      const provider = getProvider();
      const contract = getContract(provider);
      
      const [streak, lastLog] = await Promise.all([
        contract.getStreak(address),
        contract.getLastLogDay(address)
      ]);
      
      setStreakCount(Number(streak));
      setLastLogDay(Number(lastLog));
      
      // Check if user has logged today
      const todayLog = await getTodayLog(address);
      setHasLoggedToday(!!todayLog);
      
    } catch (err) {
      console.error('Error loading streak data:', err);
      setError('Failed to load streak data');
    } finally {
      setIsLoading(false);
    }
  };

  // Start a new streak
  const handleStartStreak = async () => {
    if (!address) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const provider = getProvider();
      const signer = await getSigner(provider as any);
      const contract = getContract(signer);
      
      const tx = await contract.startStreak();
      await tx.wait();
      
      // Reload streak data
      await loadStreakData();
      
    } catch (err) {
      console.error('Error starting streak:', err);
      setError('Failed to start streak. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Log a day
  const handleLogDay = async (note: string) => {
    if (!address) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const provider = getProvider();
      const signer = await getSigner(provider as any);
      const contract = getContract(signer);
      
      // Call contract to log day
      const tx = await contract.logDay();
      await tx.wait();
      
      // Add daily log to Firebase
      await addDailyLog(address, note);
      
      // Reload streak data
      await loadStreakData();
      
      setShowLogModal(false);
      
    } catch (err) {
      console.error('Error logging day:', err);
      setError('Failed to log day. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data when address changes
  useEffect(() => {
    if (address) {
      loadStreakData();
    } else {
      setStreakCount(0);
      setLastLogDay(0);
      setHasLoggedToday(false);
    }
  }, [address]);

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Flame className="w-12 h-12 text-white mr-3" />
            <h1 className="text-4xl font-bold text-white">Build Streaks</h1>
          </div>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Track your daily build progress and maintain your streak on Base. 
            Every day you build, your streak grows stronger!
          </p>
        </div>

        {/* Connection Status */}
        <div className="text-center mb-8">
          {!isConnected ? (
            <div className="space-y-4">
              <p className="text-white/80 mb-4">Connect your wallet to start building!</p>
              <div className="flex flex-wrap justify-center gap-3">
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    className="bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    {connector.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-4">
              <span className="text-white/80">
                Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <button
                onClick={() => disconnect()}
                className="text-white/60 hover:text-white transition-colors"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-md mx-auto text-center">
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="flex justify-center">
          <StreakCard
            streakCount={streakCount}
            lastLogDay={lastLogDay}
            isConnected={isConnected}
            onStartStreak={handleStartStreak}
            onLogDay={() => setShowLogModal(true)}
            hasLoggedToday={hasLoggedToday}
          />
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center text-white">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Mint Your NFT</h3>
            <p className="text-white/80">
              Get a unique streak NFT that tracks your progress on-chain
            </p>
          </div>
          
          <div className="text-center text-white">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Flame className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Build Daily</h3>
            <p className="text-white/80">
              Log your progress each day to maintain and grow your streak
            </p>
          </div>
          
          <div className="text-center text-white">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-white/80">
              View your streak history and daily logs in one place
            </p>
          </div>
        </div>
      </div>

      {/* Log Modal */}
      <LogModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        onLog={handleLogDay}
        isLoading={isLoading}
      />
    </div>
  );
}
