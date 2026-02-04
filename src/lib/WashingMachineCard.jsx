import { Timer, Droplets } from 'lucide-react';

export function WashingMachineCard({ machine }) {
  const isBusy = machine.status === 'busy';

  const formatTime = (minutes) => {
    if (minutes === null) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-8
        transition-all duration-500 ease-in-out
        ${isBusy
          ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-xl shadow-red-500/30'
          : 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-xl shadow-emerald-500/30'
        }
        hover:scale-105 transform
      `}
    >
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="text-white/90 text-lg font-medium">
          Machine {machine.id}
        </div>

        <div className={`
          p-6 rounded-full
          ${isBusy ? 'bg-red-600/50' : 'bg-emerald-600/50'}
          transition-all duration-500
        `}>
          <Droplets
            className={`
              w-16 h-16 text-white
              ${isBusy ? 'animate-pulse' : ''}
            `}
          />
        </div>

        <div className="text-center">
          <div className={`
            text-2xl font-bold text-white uppercase tracking-wider
            ${isBusy ? 'animate-pulse' : ''}
          `}>
            {machine.status}
          </div>

          {isBusy && machine.time_remaining !== null && (
            <div className="mt-3 flex items-center justify-center space-x-2 text-white/90">
              <Timer className="w-5 h-5" />
              <span className="text-xl font-semibold">
                {formatTime(machine.time_remaining)}
              </span>
            </div>
          )}
        </div>
      </div>

      {isBusy && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      )}
    </div>
  );
}
