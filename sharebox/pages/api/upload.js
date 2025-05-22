import formidable from "formidable";
import fs from "fs";
import { File } from "@web3-storage/w3up-client";
import { initStorachaClient, uploadFileToStoracha } from "../../lib/storacha";
import { validateFile } from "../../utils/fileHelpers";

// Disable Next.js body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    // Parse the multipart form data
    const form = formidable({
      keepExtensions: true,
      uploadDir: '/tmp', // Ensure we have a proper upload directory
      createDirsFromUploads: true // Create directories if they don't exist
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Get the uploaded file
    const uploadedFile = files.file;
    if (!uploadedFile) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    // Validate file structure
    if (!uploadedFile.filepath) {
      console.error("Invalid file structure:", uploadedFile);
      return res.status(400).json({
        success: false,
        error: "Invalid file upload structure",
        details: "The uploaded file is missing required properties"
      });
    }

    // Read file content
    let fileContent;
    try {
      fileContent = fs.readFileSync(uploadedFile.filepath);
    } catch (readError) {
      console.error("Error reading file:", readError);
      return res.status(500).json({
        success: false,
        error: "Failed to read uploaded file",
        details: readError.message
      });
    }

    // Create File object for Storacha
    const file = new File(
      [fileContent],
      uploadedFile.originalFilename || uploadedFile.newFilename
    );

    // Validate the file
    const validation = validateFile(file);
    if (!validation.isValid) {
      // Clean up temporary file
      fs.unlinkSync(uploadedFile.filepath);
      return res.status(400).json({
        success: false,
        error: validation.error,
      });
    }

    // Initialize Storacha client
    const client = await initStorachaClient();

    // Upload file to Storacha
    const uploadResult = await uploadFileToStoracha(client, file);

    // Clean up temporary file
    fs.unlinkSync(uploadedFile.filepath);

    return res.status(200).json({
      success: true,
      data: uploadResult,
    });
  } catch (error) {
    console.error("Upload API error:", error);

    // Provide more specific error information
    let errorMessage = "Upload failed";
    if (error.message.includes("ENOENT")) {
      errorMessage = "File not found or access denied";
    } else if (error.message.includes("maxFileSize")) {
      errorMessage = "File size exceeds 10MB limit";
    } else if (error.message.includes("Storacha client")) {
      errorMessage = "Failed to initialize storage client. Please check environment variables.";
    } else if (error.message.includes("upload file")) {
      errorMessage = "Failed to upload to storage service";
    }

    return res.status(500).json({
      success: false,
      error: errorMessage,
      details: error.message,
    });
  }
}
