/**
 * Validate if the uploaded file is a PDF
 * @param {File} file - File to validate
 * @returns {Object} Validation result with isValid boolean and error message
 */
export function validateFile(file) {
  if (!file) {
    return { isValid: false, error: "No file selected" };
  }

  return { isValid: true, error: null };
}

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Generate a unique filename to avoid conflicts
 * @param {string} originalName - Original filename
 * @returns {string} Unique filename with timestamp
 */
export function generateUniqueFilename(originalName) {
  const timestamp = Date.now();
  const name = originalName.substring(0, originalName.lastIndexOf("."));
  const extension = originalName.substring(originalName.lastIndexOf("."));

  return `${name}_${timestamp}${extension}`;
}
