// pages/api/share.js
import {  ShareFile } from "@/lib/storacha";
import { initStorachaClient } from "@/lib/storacha";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const userDID = req.body.userDid;
    const deadline = req.body.deadline;
    console.log("The content body is", userDID, deadline);

    if (!userDID || deadline === 0) {
      throw new Error("Did not receive any userDID or deadline from the frontend");
    }

    const client = await initStorachaClient();
    const allowSpaceResult = await ShareFile(client, deadline, userDID);
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", "attachment; filename=delegation.car");
    return res.status(200).send(Buffer.from(allowSpaceResult));
  } catch (error) {
    console.error("Share API error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
}
