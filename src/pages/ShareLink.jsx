import React, { useState } from "react";

const ShareLink = () => {
  const [copied, setCopied] = useState(false);
  const currentUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl)
      .then(() => setCopied(true))
      .catch(err => console.error("Copy failed:", err));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto mt-6 text-center">
      <p className="mb-2 text-gray-700 font-medium">
        Copy this link below to share card:
      </p>
      <div className="flex items-center justify-between bg-gray-100 rounded px-3 py-2 mb-3">
        <span className="text-gray-800 truncate">{currentUrl}</span>
        <button
          onClick={handleCopy}
          className="ml-2 bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600 transition"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
};

export default ShareLink;
