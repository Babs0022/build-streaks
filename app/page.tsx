'use client';

import React, { useState, useEffect } from 'react';
import { StreakCard } from '@/components/StreakCard';
import { LogModal } from '@/components/LogModal';
import { addDailyLog, getTodayLog, DailyLog } from '@/lib/firebase';
import { getBaseAppContext, subscribeToUserChanges, subscribeToWalletChanges, BaseAppContext } from '@/lib/base-app';
import { Flame, Zap, Trophy } from 'lucide-react';

export default function Home() {
  const [baseAppContext, setBaseAppContext] = useState<BaseAppContext | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [lastLogDay, setLastLogDay] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Base App connection
  useEffect(() => {
    const initBaseApp = async () => {
      const context = await getBaseAppContext();
      if (context) {
        setBaseAppContext(context);
        setAddress(context.wallet.address);
        setIsConnected(true);
      }
    };

    initBaseApp();

    // Subscribe to changes
    subscribeToUserChanges((user) => {
      setBaseAppContext(prev => prev ? { ...prev, user } : null);
    });

    subscribeToWalletChanges((wallet) => {
      setBaseAppContext(prev => prev ? { ...prev, wallet } : null);
      setAddress(wallet.address);
      setIsConnected(!!wallet.address);
    });
  }, []);

  // Load user's streak data
  const loadStreakData = async () => {
    if (!address) return;
    
    try {
      setIsLoading(true);
      
      // For now, we'll use mock data since we need to set up the contract
      // In a real implementation, you'd call the smart contract here
      setStreakCount(0);
      setLastLogDay(0);
      
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
    if (!address || !baseAppContext) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real implementation, you'd use Base App's requestTransaction
      // to call the smart contract's startStreak function
      console.log('Starting streak for user:', baseAppContext.user.username);
      
      // For now, just update the local state
      setStreakCount(1);
      
    } catch (err) {
      console.error('Error starting streak:', err);
      setError('Failed to start streak. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Log a day
  const handleLogDay = async (note: string) => {
    if (!address || !baseAppContext) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real implementation, you'd use Base App's requestTransaction
      // to call the smart contract's logDay function
      console.log('Logging day for user:', baseAppContext.user.username, 'Note:', note);
      
      // Add daily log to Firebase
      await addDailyLog(address, note);
      
      // Update streak count
      setStreakCount(prev => prev + 1);
      setHasLoggedToday(true);
      
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
      <div className="container mx-auto px-4 py-4">
        {/* Header - Optimized for frame */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <Flame className="w-8 h-8 text-white mr-2" />
            <h1 className="text-2xl font-bold text-white">Build Streaks</h1>
          </div>
          <p className="text-white/80 text-sm max-w-lg mx-auto">
            Track your daily build progress on Base
          </p>
        </div>

        {/* Connection Status */}
        <div className="text-center mb-8">
          {!isConnected ? (
            <div className="space-y-4">
              <p className="text-white/80 mb-4">Open in Base app to start building!</p>
              <div className="bg-white/20 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-white text-sm">
                  This Mini App works best in the Base app. Open this link in Base to connect your wallet and start your build streak!
                </p>
              </div>
            </div>
          ) : baseAppContext ? (
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <img 
                  src={baseAppContext.user.pfpUrl} 
                  alt={baseAppContext.user.displayName}
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-left">
                  <p className="text-white text-sm font-medium">
                    {baseAppContext.user.displayName}
                  </p>
                  <p className="text-white/60 text-xs">
                    @{baseAppContext.user.username}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-4">
              <span className="text-white/80 text-sm">
                Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
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

        {/* Features - Compact for frame */}
        <div className="mt-8 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="text-center text-white">
            <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold mb-1">Mint NFT</h3>
            <p className="text-white/80 text-xs">
              Track progress on-chain
            </p>
          </div>
          
          <div className="text-center text-white">
            <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold mb-1">Build Daily</h3>
            <p className="text-white/80 text-xs">
              Log your progress
            </p>
          </div>
          
          <div className="text-center text-white">
            <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold mb-1">Track</h3>
            <p className="text-white/80 text-xs">
              View your history
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
