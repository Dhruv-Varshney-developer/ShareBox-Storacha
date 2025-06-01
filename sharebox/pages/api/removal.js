
import { RevokeFileAccess } from "@/lib/storacha";
import { initStorachaClient } from "@/lib/storacha";
export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        error: "Method not allowed",
      });
    }
    
    try{
      const contentCID=req.body.contentCID;
      console.log("The content body is", contentCID);

      if(!contentCID){
        throw new Error("Did not receive any content cid from the frontend")
      }
      // Initialize Storacha client
      const client = await initStorachaClient();
  
      // Remove file from storacha
      const revokeResult=await RevokeFileAccess(client,contentCID)
  
      // Clean up temporary file
      return res.status(200).json({
        success: true,
        data: "Removed file successfully",
      });
    } catch (error) {
      console.error("Remove API error:", error);

      return res.status(500).json({
        success: false,
        error: errorMessage,
        details: error.message,
      });
    }
  }
  