import { useState } from "react";
import { Share2, Check, ArrowRight } from "lucide-react";
import * as Delegation from "@ucanto/core/delegation";
import * as Client from "@web3-storage/w3up-client";

export default function ShareFile() {
  const [did, setDid] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [deadline, setDeadline] = useState(Math.floor(Date.now() / 1000));

  const handleAddDidAccess = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!did.trim()) {
      setError("We need a valid DID to share with! 🎯");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userDid: did, deadline: deadline }),
      });
      const data = await response.arrayBuffer();
      console.log(data);
      const delegation = await Delegation.extract(new Uint8Array(data));
      console.log("The delegation is", delegation);

      if (!delegation.ok) {
        throw new Error("Failed to extract delegation", {
          cause: delegation.error,
        });
      } else {
        setSuccess(
          `🎉 Shared! The delegation CID is: ${delegation.ok.asCID} and new space has been created.`
        );
      }
    } catch (err) {
      setError("Failed to allow access. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 shadow-2xl hover:shadow-green-500/10 transition-all duration-500 hover:scale-[1.01] hover:border-green-500/30">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg group-hover:shadow-green-500/30 transition-all duration-300">
          <Share2 className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Share Space</h2>
          <p className="text-gray-400 text-sm mt-1">
            Spread the love, share the access 💚
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
          <span className="font-medium">{success.slice(0, 100)}...</span>
        </div>
      )}

      <form onSubmit={handleAddDidAccess} className="space-y-6">
        <div>
          <label className="block text-white font-bold mb-4 text-lg">
            User DID
          </label>
          <input
            type="text"
            value={did}
            onChange={(e) => setDid(e.target.value)}
            placeholder="Enter the DID of the user"
            className="w-full p-5 bg-gray-800/80 border border-gray-600 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:bg-gray-800 text-lg backdrop-blur-sm"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-white font-bold mb-4 text-lg">
            Access Deadline
          </label>
          <input
            type="datetime-local"
            className="w-full p-5 bg-gray-800/80 border border-gray-600 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:bg-gray-800 text-lg backdrop-blur-sm"
            onChange={(e) => {
              console.log(
                Math.floor(new Date(e.target.value).getTime() / 1000)
              );
              setDeadline(
                Math.floor(new Date(e.target.value).getTime() / 1000)
              );
            }}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={!did.trim() || loading}
          className={`w-full py-5 px-8 rounded-2xl font-bold text-white transition-all duration-500 flex items-center justify-center gap-3 text-lg ${
            loading || !did.trim()
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 transform hover:scale-[1.02] shadow-xl hover:shadow-green-500/30"
          }`}
        >
          {loading ? (
            <>
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              Sharing the magic...
            </>
          ) : (
            <>
              <Share2 className="w-6 h-6" />
              Share The Space Access
              <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
