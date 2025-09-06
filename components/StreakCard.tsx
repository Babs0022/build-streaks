import React from 'react';
import { Flame, Calendar, Trophy } from 'lucide-react';

interface StreakCardProps {
  streakCount: number;
  lastLogDay?: number;
  isConnected: boolean;
  onStartStreak: () => void;
  onLogDay: () => void;
  hasLoggedToday?: boolean;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  streakCount,
  lastLogDay,
  isConnected,
  onStartStreak,
  onLogDay,
  hasLoggedToday = false,
}) => {
  const formatLastLogDay = (timestamp: number) => {
    if (timestamp === 0) return 'Never';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  const getStreakMessage = () => {
    if (streakCount === 0) {
      return "Start your build streak today!";
    } else if (streakCount === 1) {
      return "Great start! Keep it going!";
    } else if (streakCount < 7) {
      return "Building momentum! 🔥";
    } else if (streakCount < 30) {
      return "You're on fire! 🔥🔥";
    } else {
      return "Legendary streak! 🔥🔥🔥";
    }
  };

  const getStreakColor = () => {
    if (streakCount === 0) return 'text-gray-500';
    if (streakCount < 7) return 'text-streak-500';
    if (streakCount < 30) return 'text-streak-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Flame className={`w-8 h-8 ${getStreakColor()}`} />
          <h2 className="text-2xl font-bold ml-2">Build Streak</h2>
        </div>
        
        <div className="mb-6">
          <div className={`text-6xl font-bold ${getStreakColor()} mb-2`}>
            {streakCount}
          </div>
          <p className="text-gray-600 text-lg">
            {streakCount === 1 ? 'day' : 'days'} streak
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {getStreakMessage()}
          </p>
        </div>

        {lastLogDay !== undefined && (
          <div className="flex items-center justify-center mb-6 text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            Last logged: {formatLastLogDay(lastLogDay)}
          </div>
        )}

        <div className="space-y-3">
          {!isConnected ? (
            <div className="text-center">
              <p className="text-gray-500 mb-4">Connect your wallet to start building!</p>
            </div>
          ) : streakCount === 0 ? (
            <button
              onClick={onStartStreak}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <Trophy className="w-5 h-5 mr-2" />
              Start Your Streak
            </button>
          ) : (
            <button
              onClick={onLogDay}
              disabled={hasLoggedToday}
              className={`w-full font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center ${
                hasLoggedToday
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-streak-500 hover:bg-streak-600 text-white'
              }`}
            >
              <Flame className="w-5 h-5 mr-2" />
              {hasLoggedToday ? 'Already logged today!' : 'Log Today'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
