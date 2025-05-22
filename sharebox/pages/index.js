import { useState } from "react";
import Head from "next/head";
import FileUploader from "../components/FileUploader";
import UploadResult from "../components/UploadResult";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [uploadResult, setUploadResult] = useState(null);
  const [globalError, setGlobalError] = useState(null);

  const handleUploadSuccess = (result) => {
    setUploadResult(result);
    setGlobalError(null);
  };

  const handleUploadError = (error) => {
    setGlobalError(error);
    setUploadResult(null);
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

        {globalError && (
          <div className={styles.globalError}>
            <p>{globalError}</p>
          </div>
        )}

        <FileUploader
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />

        <UploadResult result={uploadResult} />
      </main>

      <footer className={styles.footer}>
        <p>Powered by Storacha</p>
      </footer>
    </div>
  );
}
