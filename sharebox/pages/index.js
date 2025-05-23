// sharebox/pages/index.js
import Head from "next/head";
import { useState } from "react";
import FileUploader from "../components/FileUploader";
import UploadResult from "../components/UploadResult";

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
    <div className="min-h-screen px-4 flex flex-col justify-center items-center">
      <Head>
        <title>ShareBox - UCAN File Sharing</title>
        <meta name="description" content="Securely share files with UCANs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="py-12 flex-1 flex flex-col justify-start items-center w-full max-w-2xl">
        <h1 className="m-0 leading-tight text-5xl font-bold text-center">
          Welcome to <span className="text-orange-600">ShareBox</span>
        </h1>

        <p className="text-center leading-normal text-xl my-4 mx-0">
          Upload files and share them with specific permissions using UCANs
        </p>

        {globalError && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-8 text-center">
            <p>{globalError}</p>
          </div>
        )}

        <FileUploader
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />

        <UploadResult result={uploadResult} />
      </main>

      <footer className="w-full h-16 border-t border-gray-200 flex justify-center items-center text-sm text-gray-600">
        <p>Powered by Storacha</p>
      </footer>
    </div>
  );
}