import { useDebugPanel } from '@/hooks/useDebugPanel';

const DebugPanel = () => {
  const { isOpen, scrollY, activeSection, route, theme } = useDebugPanel();

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[10000] bg-black/90 text-white p-4 rounded-lg font-mono text-xs space-y-2 min-w-[200px] border border-gray-700">
      <div className="font-bold text-primary-400 mb-2">DEBUG PANEL</div>
      <div>
        <span className="text-gray-400">Route:</span> {route}
      </div>
      <div>
        <span className="text-gray-400">ScrollY:</span> {Math.round(scrollY)}px
      </div>
      <div>
        <span className="text-gray-400">Section:</span> {activeSection || 'none'}
      </div>
      <div>
        <span className="text-gray-400">Theme:</span> {theme}
      </div>
      <div className="text-gray-500 text-[10px] mt-2 pt-2 border-t border-gray-700">
        Press 'D' to toggle
      </div>
    </div>
  );
};

export default DebugPanel;
