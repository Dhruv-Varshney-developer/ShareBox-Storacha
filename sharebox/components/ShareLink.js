export default function ShareLink({ shareLink }) {
  if (!shareLink) return null;

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(shareLink.url);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatExpiration = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffInSeconds = Math.floor((date - now) / 1000);
    
    if (diffInSeconds <= 0) return "Expired";
    
    const days = Math.floor(diffInSeconds / 86400);
    const hours = Math.floor((diffInSeconds % 86400) / 3600);
    
    let remaining = [];
    if (days > 0) remaining.push(`${days} day${days > 1 ? 's' : ''}`);
    if (hours > 0) remaining.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    
    return `${date.toLocaleString()} (${remaining.join(' ') || 'Less than 1 hour'} remaining)`;
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md mt-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Shareable Link Created</h2>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center">
          <span className="font-medium text-gray-700 w-24">Permission:</span>
          <span className="text-gray-900 capitalize">{shareLink.permission}</span>
        </div>
        
        {shareLink.expiration && (
          <div className="flex items-start">
            <span className="font-medium text-gray-700 w-24">Expires:</span>
            <span className="text-gray-900">
              {formatExpiration(shareLink.expiration)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label className="font-medium text-gray-700">Shareable URL:</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={shareLink.url}
            readOnly
            className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 overflow-x-auto"
          />
          <button 
            onClick={handleCopyClick} 
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}