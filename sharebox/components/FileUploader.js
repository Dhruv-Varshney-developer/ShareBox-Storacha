import { useState } from "react";
import { validateFile } from "../utils/fileHelpers";
import styles from "../styles/Home.module.css";

export default function FileUploader({ onUploadSuccess, onUploadError }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      // Validate file on the frontend as well
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
      // Create form data
      const formData = new FormData();
      formData.append("file", file);

      // Send file to backend API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      // Check if the response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Server error: ${text}`);
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      // Reset form
      setFile(null);
      document.getElementById("file").value = "";

      // Call success callback
      if (onUploadSuccess) {
        onUploadSuccess(result.data);
      }
    } catch (err) {
      console.error("Upload error:", err);
      const errorMessage = err.message || "Failed to upload file";
      setError(errorMessage);

      // Call error callback
      if (onUploadError) {
        onUploadError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h2>Upload a File</h2>
      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleUpload} className={styles.form}>
        <div className={styles.fileInput}>
          <label htmlFor="file">Select a PDF file:</label>
          <input
            type="file"
            id="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className={styles.button}
          disabled={!file || loading}
        >
          {loading ? "Uploading..." : "Upload File"}
        </button>
      </form>
    </div>
  );
}
