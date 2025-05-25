import { createShareableLink, initStorachaClient } from "@/lib/storacha";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { cid, permission, expiration } = req.body;

    // Validate input
    if (!cid || typeof cid !== 'string') {
      return res.status(400).json({ error: "Missing or invalid CID" });
    }

    const validPermissions = ['read', 'download', 'edit'];
    if (!validPermissions.includes(permission)) {
      return res.status(400).json({
        error: `Invalid permission. Must be one of: ${validPermissions.join(', ')}`
      });
    }

    // Initialize client
    const client = await initStorachaClient();
    if (!client) {
      throw new Error("Failed to initialize Storacha client");
    }

    // Create shareable link
    const shareData = await createShareableLink(client, {
      cid,
      permission,
      expiration: expiration ? Number(expiration) : undefined, // Ensure number if provided
    });

    // Return success response
    return res.status(200).json({
      success: true,
      data: {
        url: shareData.url,
        cid: shareData.cid,
        permission: shareData.permission,
        expiration: shareData.expiration || null,
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("API Error generating share link:", error);
    

    let errorMessage = "Failed to generate share link";
    if (error.message.includes("Invalid CID")) {
      errorMessage = "Invalid content identifier";
    } else if (error.message.includes("No current space")) {
      errorMessage = "Storage space not configured";
    }

    return res.status(500).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}