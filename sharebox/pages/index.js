import Head from "next/head";
import { useState } from "react";
import { Shield } from "lucide-react";
import FileUploader from "../components/FileUploader";
import UploadResult from "../components/UploadResult";
import RevokeAccess from "@/components/RevokeAccess";
import ShareFile from "@/components/ShareSpace";

console.log("Index.js is loading");


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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Head>
        <title>ShareBox - UCAN File Sharing</title>
        <meta
          name="description"
          content="Learn UCANs and Storacha through hands-on file sharing"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Electric animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-screen filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-screen filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-screen filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, cyan 1px, transparent 0)`,
          backgroundSize: "50px 50px",
        }}
      ></div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-20 animate-fadeInDown">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="p-5 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-3xl shadow-2xl shadow-cyan-500/30">
              <Shield className="w-14 h-14 text-white" />
            </div>
            <h1 className="text-8xl font-black text-cyan-400">ShareBox</h1>
          </div>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium">
            Learn <span className="text-cyan-400 font-bold">UCANs</span> and{" "}
            <span className="text-blue-400 font-bold">Storacha</span> through
            hands-on file sharing. The perfect{" "}
            <span className="text-white font-bold">playground</span> for
            exploring
            <span className="text-cyan-400 font-bold">
              {" "}
              decentralized storage
            </span>{" "}
            ⚡
          </p>
        </div>

        {/* Global Error */}
        {globalError && (
          <div className="max-w-4xl mx-auto mb-8 animate-slideInDown">
            <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-6 py-4 rounded-2xl flex items-center gap-3 backdrop-blur-sm">
              <div className="w-3 h-3 bg-red-400 rounded-full flex-shrink-0 animate-pulse"></div>
              <p className="font-medium">{globalError}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="animate-fadeInUp">
            <FileUploader
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="animate-fadeInLeft">
              <ShareFile />
            </div>
            <div className="animate-fadeInRight">
              <RevokeAccess />
            </div>
          </div>

          {uploadResult && <UploadResult result={uploadResult} />}
        </div>

        {/* Footer */}
        <footer className="text-center mt-24 pt-12 border-t border-gray-800">
          <div className="flex items-center justify-center gap-8 mb-6">
            <a
              href="https://storacha.network"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold transition-colors duration-200 text-lg"
            >
              Powered by Storacha
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
            <span className="text-gray-600">•</span>
            <a
              href="https://github.com/Dhruv-Varshney-developer/ShareBox-Storacha"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white font-bold transition-colors duration-200 text-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              View Source
            </a>
          </div>
          <p className="text-gray-500 text-lg">Built with 💙 for Storacha</p>
        </footer>
      </div>
    </div>
  );
}
