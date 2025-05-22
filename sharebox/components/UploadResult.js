import { formatFileSize } from "../utils/fileHelpers";
import styles from "../styles/Home.module.css";

export default function UploadResult({ result }) {
  if (!result) return null;

  const handleCopyClick = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.log("Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className={styles.result}>
      <h2>Upload Successful!</h2>

      <div className={styles.resultGrid}>
        <div className={styles.resultItem}>
          <strong>File:</strong> {result.filename}
        </div>

        <div className={styles.resultItem}>
          <strong>Size:</strong> {formatFileSize(result.size)}
        </div>

        <div className={styles.resultItem}>
          <strong>Uploaded:</strong>{" "}
          {new Date(result.uploadedAt).toLocaleString()}
        </div>
      </div>

      <div className={styles.cidSection}>
        <div className={styles.cidHeader}>
          <strong>Content ID (CID):</strong>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <code className={styles.cidText}>{result.cid}</code>
        </div>
      </div>

      <div className={styles.linkSection}>
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          View on IPFS Gateway →
        </a>
      </div>
    </div>
  );
}
