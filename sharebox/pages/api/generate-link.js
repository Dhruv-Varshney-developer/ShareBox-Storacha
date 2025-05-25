import { createShareableLink, initStorachaClient } from "@/lib/storacha";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const { cid, permission, expiration } = req.body;

    const validPermission = ['read', 'download', 'edit'];

    if(!validPermission.includes(permission)){
        return res.status(400).json({
            error: `Invalid permission. Use: ${validPermission.join(', ')}` 
        })
    }
    const client = await initStorachaClient();

    const shareData = await createShareableLink( client, {
      cid,
      permission,
      expiration: expiration || undefined,
    });

    return res.status(200).json({
      success: true,
      shareData
    });
  } catch (error) {
    console.error("API Error generating share link:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to generate share link",
      details:
        error.message ||
        "An unexpected error occurred while generating the share link.",
    });
  }
}
