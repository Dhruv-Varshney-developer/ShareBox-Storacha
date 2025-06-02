import { useState } from "react";

export default function RevokeAccess() {
  const [cid, setCid] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRevoke = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!cid.trim() || (!cid.startsWith("bafy") &&  !cid.startsWith("bafk"))) {
      setError("Please enter a valid CID.");
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
      if (result.success){
        setSuccess(`Access revoked for CID: ${cid}`);
      }else{
        setSuccess(`Failed Attempt to revoke access for CID: ${cid}`)
      }
      setCid("");
    } catch (err) {
      setError("Failed to revoke access. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4 p-6 w-full rounded-xl bg-white shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
       Revoke Access by entering CID
      </h2>

      {error && (
        <p className="text-red-600 bg-red-50 px-4 py-2 rounded border-l-4 border-red-600 mb-4">
          {error}
        </p>
      )}

      {success && (
        <p className="text-green-600 bg-green-50 px-4 py-2 rounded border-l-4 border-green-600 mb-4">
          {success}
        </p>
      )}

      <form onSubmit={handleRevoke} className="flex flex-col gap-4">
        <label htmlFor="cid" className="font-medium text-gray-700">
          Enter the CID of the file:
        </label>
        <input
          type="text"
          id="cid"
          value={cid}
          onChange={(e) => setCid(e.target.value)}
          placeholder="e.g., bafybeigdyrztg..."
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          disabled={loading}
        />

        <button
          type="submit"
          className={`px-5 py-3 rounded text-white font-medium transition ${
            loading || !cid.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-600 hover:bg-orange-700"
          }`}
          disabled={!cid.trim() || loading}
        >
          {loading ? "Revoking..." : "Revoke Access"}
        </button>
      </form>
    </div>
  );
}
