import { useState } from "react";
import {
  Upload,
  FileText,
  Zap,
  Cloud,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { validateFile } from "../utils/fileHelpers";

export default function FileUploader({ onUploadSuccess, onUploadError }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

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

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validation = validateFile(droppedFile);
      if (!validation.isValid) {
        setError(validation.error);
        setFile(null);
        return;
      }
      setFile(droppedFile);
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
    <div className="group bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 hover:scale-[1.01] hover:border-cyan-500/30">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl shadow-lg group-hover:shadow-cyan-500/30 transition-all duration-300">
          <Upload className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Upload Your File</h2>
          <p className="text-gray-400 text-sm mt-1">
            Drag, drop, and watch the magic happen ⚡
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-5 py-4 rounded-2xl mb-6 flex items-center gap-3 animate-shake backdrop-blur-sm">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleUpload} className="space-y-6">
        <div
          className={`relative border-2 border-dashed transition-all duration-500 rounded-3xl p-12 text-center overflow-hidden ${
            isDragOver
              ? "border-cyan-400 bg-cyan-500/10 scale-105 shadow-lg shadow-cyan-500/20"
              : file
              ? "border-green-400 bg-green-500/10 shadow-lg shadow-green-500/20"
              : "border-gray-600 hover:border-cyan-400 hover:bg-cyan-500/5"
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
        >
          {/* Electric glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

          <input
            type="file"
            id="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={loading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="relative space-y-6">
            {file ? (
              <>
                <div className="relative">
                  <FileText className="w-24 h-24 text-green-400 mx-auto animate-bounce" />
                  <Sparkles className="w-6 h-6 text-cyan-400 absolute -top-1 -right-1 animate-spin" />
                  <div className="absolute inset-0 w-24 h-24 mx-auto bg-green-400 rounded-full opacity-20 animate-pulse"></div>
                </div>
                <div>
                  <p className="text-green-300 font-bold text-xl">
                    {file.name}
                  </p>
                  <p className="text-gray-400 mt-2">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to launch!
                    🚀
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <Cloud className="w-24 h-24 text-gray-500 mx-auto transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse"></div>
                </div>
                <div>
                  <p className="text-white font-bold text-2xl mb-3">
                    Drop your PDF here
                  </p>
                  <p className="text-gray-400 text-lg">
                    or click to browse • Max 10MB
                  </p>
                  <p className="text-sm text-gray-500 mt-3">
                    We'll handle it with electric precision ⚡
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!file || loading}
          className={`w-full py-5 px-8 rounded-2xl font-bold text-white transition-all duration-500 flex items-center justify-center gap-3 text-lg ${
            loading || !file
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 transform hover:scale-[1.02] shadow-xl hover:shadow-cyan-500/30"
          }`}
        >
          {loading ? (
            <>
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              Uploading... Hold tight!
            </>
          ) : (
            <>
              <Zap className="w-6 h-6" />
              Upload to IPFS
              <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
