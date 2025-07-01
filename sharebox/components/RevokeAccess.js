import { useState } from "react";
import { Trash2, Check, Lock, ArrowRight } from "lucide-react";

export default function RevokeAccess() {
  const [cid, setCid] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRevoke = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!cid.trim() || (!cid.startsWith("bafy") && !cid.startsWith("bafk"))) {
      setError("Hmm, that doesn't look like a valid CID 🤔");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/removal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contentCID: cid }),
      });
      const result = await response.json();
      console.log("revoke result:", result);
      if (result.success) {
        setSuccess(
          `🔒 Access revoked! CID ${cid.slice(0, 20)}... is now locked down.`
        );
      } else {
        setSuccess(
          `Failed attempt to revoke access for CID: ${cid.slice(0, 20)}...`
        );
      }
      setCid("");
    } catch (err) {
      setError("Failed to revoke access. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 shadow-2xl hover:shadow-red-500/10 transition-all duration-500 hover:scale-[1.01] hover:border-red-500/30">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
          <Lock className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Revoke Access</h2>
          <p className="text-gray-400 text-sm mt-1">
            Lock it down, keep it secure 🔒
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-5 py-4 rounded-2xl mb-6 flex items-center gap-3 animate-shake backdrop-blur-sm">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-900/30 border border-green-500/50 text-green-300 px-5 py-4 rounded-2xl mb-6 flex items-center gap-3 animate-bounce backdrop-blur-sm">
          <Check className="w-5 h-5 text-green-400" />
          <span className="font-medium">{success}</span>
        </div>
      )}

      <form onSubmit={handleRevoke} className="space-y-6">
        <div>
          <label className="block text-white font-bold mb-4 text-lg">
            Content Identifier (CID)
          </label>
          <input
            type="text"
            value={cid}
            onChange={(e) => setCid(e.target.value)}
            placeholder="bafybeigdyrztg... (paste your CID here)"
            className="w-full p-5 bg-gray-800/80 border border-gray-600 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 hover:bg-gray-800 text-lg backdrop-blur-sm"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={!cid.trim() || loading}
          className={`w-full py-5 px-8 rounded-2xl font-bold text-white transition-all duration-500 flex items-center justify-center gap-3 text-lg ${
            loading || !cid.trim()
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 transform hover:scale-[1.02] shadow-xl hover:shadow-red-500/30"
          }`}
        >
          {loading ? (
            <>
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              Revoking access...
            </>
          ) : (
            <>
              <Trash2 className="w-6 h-6" />
              Revoke Access
              <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
