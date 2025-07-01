import { useState } from "react";
import { Check, Copy, Eye } from "lucide-react";
import { formatFileSize } from "../utils/fileHelpers";

export default function UploadResult({ result }) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleCopyClick = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-green-500/50 p-8 shadow-2xl shadow-green-500/10 animate-slideInUp">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg shadow-green-500/30">
          <Check className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Success! 🎉</h2>
          <p className="text-gray-400 text-lg mt-1">
            Your file is now living on IPFS
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm font-medium mb-2">Filename</p>
          <p className="text-white font-bold text-lg truncate">
            {result.filename}
          </p>
        </div>
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm font-medium mb-2">Size</p>
          <p className="text-white font-bold text-lg">
            {formatFileSize(result.size)}
          </p>
        </div>
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm font-medium mb-2">Uploaded</p>
          <p className="text-white font-bold text-lg">
            {new Date(result.uploadedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-white font-bold mb-4 text-lg">
          Content Identifier (CID)
        </p>
        <div className="flex items-center gap-4 p-5 bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700">
          <code className="flex-1 text-cyan-400 font-mono text-base break-all">
            {result.cid}
          </code>
          <button
            onClick={() => handleCopyClick(result.cid)}
            className="p-3 bg-gray-700/80 hover:bg-cyan-500/20 border border-gray-600 hover:border-cyan-500/50 rounded-xl transition-all duration-200 flex-shrink-0"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-400" />
            ) : (
              <Copy className="w-5 h-5 text-cyan-400" />
            )}
          </button>
        </div>
      </div>

      <div className="text-center">
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-xl hover:shadow-cyan-500/30 text-lg"
        >
          <Eye className="w-6 h-6" />
          View on IPFS Gateway →
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
