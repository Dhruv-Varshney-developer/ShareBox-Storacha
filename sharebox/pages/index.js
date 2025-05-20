import { useEffect, useState } from "react";
import Head from "next/head";
import * as Storage from "@web3-storage/w3up-client";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [ownerUCAN, setOwnerUCAN] = useState(null);
  const [client, setClient] = useState(null);
  const [error, setError] = useState(null);

  // Initialize Storacha client when component mounts
  useEffect(() => {
    const initializeClient = async () => {
      try {
        const storageClient = await Storage.create();
        setClient(storageClient)
      } catch (err) {
        console.error("Error initializing Storacha client:", err);
        setError("Failed to initialize storage client");
      }
    };

    initializeClient();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("Please select a PDF file");
        setFile(null);
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    if (!client) {
      setError("Storage client not initialized");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Upload file directly to Storacha
      const rootCID = await client.uploadFile(file);
      console.log("Upload successful, CID:", rootCID);

      setUploadResult({
        cid: rootCID.toString(),
        filename: file.name,
        size: file.size,
        type: file.type,
        url: `https://w3s.link/ipfs/${rootCID}`,
      });

      // Generate owner UCAN
      // This is a simplified example - in a real app, you would store this securely
      // and integrate with your backend for proper delegation
      const delegation = await client.createDelegation({
        with: client.spaces[0].did(),
        abilities: ["storacha/upload", "storacha/download", "storacha/delete"],
        expiration: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      });

      const serializedUCAN = await delegation.archive();
      setOwnerUCAN(serializedUCAN.toString("base64"));
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload file: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>ShareBox - UCAN File Sharing</title>
        <meta name="description" content="Securely share files with UCANs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <span className={styles.highlight}>ShareBox</span>
        </h1>

        <p className={styles.description}>
          Upload files and share them with specific permissions using UCANs
        </p>

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

        {uploadResult && (
          <div className={styles.result}>
            <h2>Upload Successful!</h2>
            <p>
              <strong>File:</strong> {uploadResult.filename}
            </p>
            <p>
              <strong>Type:</strong> {uploadResult.type}
            </p>
            <p>
              <strong>Size:</strong> {Math.round(uploadResult.size / 1024)} KB
            </p>
            <p>
              <strong>CID:</strong> {uploadResult.cid}
            </p>
            <p>
              <a
                href={uploadResult.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                View on IPFS Gateway
              </a>
            </p>
          </div>
        )}

        {ownerUCAN && (
          <div className={styles.ucanSection}>
            <h2>Owner UCAN Token</h2>
            <p>
              This is your owner UCAN token that grants full access to this
              file:
            </p>
            <div className={styles.ucanDisplay}>
              <textarea
                readOnly
                value={ownerUCAN}
                className={styles.ucanTextarea}
                rows={5}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(ownerUCAN);
                }}
                className={styles.copyButton}
              >
                Copy UCAN
              </button>
            </div>
            <p className={styles.info}>
              <strong>Note:</strong> In a production app, you would not display
              the raw UCAN, but instead securely store it and use it to generate
              delegated UCANs for sharing.
            </p>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Powered by Storacha</p>
      </footer>
    </div>
  );
}
