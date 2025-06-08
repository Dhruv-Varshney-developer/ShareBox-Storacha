import { useState } from "react";
import * as Delegation from '@ucanto/core/delegation'
import * as Client from '@web3-storage/w3up-client'

export default function ShareFile() {
  const [did, setDid] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [deadline, setDeadline] = useState(
    Math.floor(Date.now() / 1000)
  );

  const handleAddDidAccess = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!did.trim()) {
      setError("Please enter a valid DID.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userDid: did, deadline : deadline }),
      });
      const data = await response.arrayBuffer();
      console.log(data)
      const delegation = await Delegation.extract(new Uint8Array(data))
      console.log("The delegation is",delegation)
      if (!delegation.ok) {
        throw new Error('Failed to extract delegation', { cause: delegation.error })
      }else{
        setSuccess(`The returned delegation CID is :${delegation.ok.asCID}`)
      }
    } catch (err) {
      setError("Failed to allow access. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4 p-6 w-full rounded-xl bg-white shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Share Space Access By Entering the DID
      </h2>

      {error && (
        <p className="text-red-600 bg-red-50 px-4 py-2 rounded border-l-4 border-red-600 mb-4">
          {error}
        </p>
      )}

      {success && (
        <p className="text-green-600 bg-green-50 px-4 py-2 rounded border-l-4 border-green-600 mb-4">
          {success.slice(0,100)}....
        </p>
      )}

      <form onSubmit={handleAddDidAccess} className="flex flex-col gap-4">
        <label htmlFor="did" className="font-medium text-gray-700">
          Enter the DID of the user:
        </label>
        <input
          type="text"
          id="did"
          value={did}
          onChange={(e) => setDid(e.target.value)}
          placeholder="Enter the DID of the user"
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          disabled={loading}
        />

        <label htmlFor="deadline" className="font-medium text-gray-700">
          Select Deadline:
        </label>
        <input
          type="datetime-local"
          id="deadline"
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          onChange={(e) =>{
            console.log(Math.floor(new Date(e.target.value).getTime() / 1000));
            setDeadline(Math.floor(new Date(e.target.value).getTime() / 1000))
          }}
          disabled={loading}
        />

        <button
          type="submit"
          className={`px-5 py-3 rounded text-white font-medium transition ${
            loading || !did.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-600 hover:bg-orange-700"
          }`}
          disabled={!did.trim() || loading}
        >
          {loading ? "Sharing..." : "Share The Space Access"}
        </button>
      </form>
    </div>
  );
}
