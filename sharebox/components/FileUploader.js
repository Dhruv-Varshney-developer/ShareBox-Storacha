import { useState } from "react";
import { validateFile } from "../utils/fileHelpers";

export default function FileUploader({ onUploadSuccess, onUploadError }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const validation = validateFile(selectedFile);
      if (!validation.isValid) {
        setError(validation.error);
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Server error: ${text}`);
      }

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      setFile(null);
      document.getElementById("file").value = "";
      if (onUploadSuccess) onUploadSuccess(result.data);
    } catch (err) {
      console.error("Upload error:", err);
      const errorMessage = err.message || "Failed to upload file";
      setError(errorMessage);
      if (onUploadError) onUploadError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4 p-6 w-full rounded-xl bg-white shadow-md">
      <h2 className="text-2xl mb-4">Upload a File</h2>
      {error && (
        <p className="text-red-600 bg-red-50 px-3 py-2 rounded border-l-4 border-red-600 my-4">
          {error}
        </p>
      )}

      <form onSubmit={handleUpload} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="file" className="font-medium">
            Select a PDF file:
          </label>
          <input
            type="file"
            id="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={loading}
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          className={`px-5 py-3 rounded text-white font-medium ${
            loading || !file
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-600 hover:bg-orange-700"
          }`}
          disabled={!file || loading}
        >
          {loading ? "Uploading..." : "Upload File"}
        </button>
      </form>
    </div>
  );
}