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
    <div className="bg-white rounded-xl shadow-lg p-4 max-w-sm mx-auto">
      <div className="text-center">
        <div className="flex items-center justify-center mb-3">
          <Flame className={`w-6 h-6 ${getStreakColor()}`} />
          <h2 className="text-xl font-bold ml-2">Build Streak</h2>
        </div>
        
        <div className="mb-4">
          <div className={`text-4xl font-bold ${getStreakColor()} mb-2`}>
            {streakCount}
          </div>
          <p className="text-gray-600 text-sm">
            {streakCount === 1 ? 'day' : 'days'} streak
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {getStreakMessage()}
          </p>
        </div>

        {lastLogDay !== undefined && (
          <div className="flex items-center justify-center mb-4 text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            Last logged: {formatLastLogDay(lastLogDay)}
          </div>
        )}

        <div className="space-y-2">
          {!isConnected ? (
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-2">Open in Base app to start!</p>
            </div>
          ) : streakCount === 0 ? (
            <button
              onClick={onStartStreak}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm"
            >
              <Trophy className="w-4 h-4 mr-1" />
              Start Streak
            </button>
          ) : (
            <button
              onClick={onLogDay}
              disabled={hasLoggedToday}
              className={`w-full font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm ${
                hasLoggedToday
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-streak-500 hover:bg-streak-600 text-white'
              }`}
            >
              <Flame className="w-4 h-4 mr-1" />
              {hasLoggedToday ? 'Already logged!' : 'Log Today'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
