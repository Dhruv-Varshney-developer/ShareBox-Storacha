import { useState } from "react";

export default function PermissionForm({ cid, onGenerateLink }) {
  const [permission, setPermission] = useState("read");
  const [expirationPreset, setExpirationPreset] = useState("");
  const [customExpiration, setCustomExpiration] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const calculateExpiration = () => {
    if (!expirationPreset) return null;

    const now = Math.floor(Date.now() / 1000);
    const presets = {
      "1h": now + 3600,
      "1d": now + 86400,
      "1w": now + 604800,
      "1m": now + 2592000, // 30 days
    };

    return expirationPreset === "custom"
      ? customExpiration
        ? Math.floor(new Date(customExpiration).getTime() / 1000)
        : null
      : presets[expirationPreset];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cid) return;

    setIsGenerating(true);
    setError(null);

    try {
      const expirationTimestamp = calculateExpiration();
      console.log("Submitting with:", {
        cid,
        permission,
        expiration: expirationTimestamp || undefined,
      });
      const response = await fetch("/api/generate-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cid,
          permission,
          expiration: expirationTimestamp || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate shareable link", response);
      }

      const result = await response.json();
      if (onGenerateLink) {
        onGenerateLink(result.data);
      }
    } catch (err) {
      console.error("Error generating link:", err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Create Shareable Link
      </h2>
      {error && (
        <p className="mb-4 p-2 text-red-600 bg-red-100 rounded border-l-4 border-red-500">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="permission" className="font-medium text-gray-700">
            Permission:
          </label>
          <select
            id="permission"
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="read">View only</option>
            <option value="download">Download</option>
            <option value="edit">Edit</option>
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="expiration" className="font-medium text-gray-700">
            Expiration:
          </label>
          <select
            value={expirationPreset}
            onChange={(e) => setExpirationPreset(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">No expiration</option>
            <option value="1h">1 Hour</option>
            <option value="1d">1 Day</option>
            <option value="1w">1 Week</option>
            <option value="1m">1 Month</option>
            <option value="custom">Custom date/time</option>
          </select>

          {expirationPreset === "custom" && (
            <input
              type="datetime-local"
              id="customExpiration"
              value={customExpiration}
              onChange={(e) => setCustomExpiration(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mt-2"
              min={new Date().toISOString().slice(0, 16)}
            />
          )}
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isGenerating || !cid
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          } transition-colors`}
          disabled={isGenerating || !cid}
        >
          {isGenerating ? "Generating..." : "Generate Link"}
        </button>
      </form>
    </div>
  );
}
