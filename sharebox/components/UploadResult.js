import { formatFileSize } from "../utils/fileHelpers";

export default function UploadResult({ result }) {
  if (!result) return null;

  const handleCopyClick = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="mt-8 p-6 w-full rounded-xl bg-white shadow-md border-l-4 border-green-500">
      <h2 className="text-2xl mb-4">Upload Successful!</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-2 bg-gray-50 rounded text-sm">
          <strong>File:</strong> {result.filename}
        </div>
        <div className="p-2 bg-gray-50 rounded text-sm">
          <strong>Size:</strong> {formatFileSize(result.size)}
        </div>
        <div className="p-2 bg-gray-50 rounded text-sm">
          <strong>Uploaded:</strong>{" "}
          {new Date(result.uploadedAt).toLocaleString()}
        </div>
      </div>

      <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="mb-2">
          <strong>Content ID (CID):</strong>
        </div>
        <div className="flex items-center gap-2">
          <code className="block break-all font-mono text-sm bg-white p-2 rounded border border-gray-300 text-gray-700">
            {result.cid}
          </code>
          <button
            onClick={() => handleCopyClick(result.cid)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="text-center mt-6">
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          View on IPFS Gateway →
        </a>
      </div>
    </div>
  );
}