import { useReefStore } from '../store/useReefStore';

export function DebugPanel() {
  const store = useReefStore();
  const { climbPrep, address, connected, lastGotoPublished } = store();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm text-xs p-2">
      <div className="container mx-auto flex items-center gap-4 text-gray-300">
        <div className="flex items-center gap-2">
          <span>{address}</span>
          <div
            className={`w-2 h-2 rounded-full ${
              connected ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span>{connected ? 'Connected' : 'Disconnected'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Last Goto:</span>
          <code className="font-mono">{lastGotoPublished}</code>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Climb Prep:</span>
          <div
            className={`w-2 h-2 rounded-full ${
              climbPrep ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
