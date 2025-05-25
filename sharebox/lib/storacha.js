import * as Client from "@web3-storage/w3up-client";
import { Delegation } from "@web3-storage/w3up-client/delegation";
import { Signer } from "@web3-storage/w3up-client/principal/ed25519";
import * as Proof from "@web3-storage/w3up-client/proof";
import { StoreMemory } from "@web3-storage/w3up-client/stores/memory";

/**
 * Initialize authenticated Storacha client
 * @returns {Promise<Client>} Authenticated client instance
 */
export async function initStorachaClient() {
  try {
    // Load client with specific private key
    const principal = Signer.parse(process.env.STORACHA_KEY);
    const store = new StoreMemory();
    const client = await Client.create({ principal, store });

    // Add proof that this agent has been delegated capabilities on the space
    const proof = await Proof.parse(process.env.STORACHA_PROOF);
    const space = await client.addSpace(proof);
    await client.setCurrentSpace(space.did());

    return client;
  } catch (error) {
    console.error("Error initializing Storacha client:", error);
    throw new Error("Failed to initialize Storacha client: " + error.message);
  }
}

/**
 * Upload a file to Storacha
 * @param {Client} client - Authenticated Storacha client
 * @param {File} file - File to upload
 * @returns {Promise<Object>} Upload result with CID and metadata
 */
export async function uploadFileToStoracha(client, file) {
  try {
    const cid = await client.uploadFile(file);

    return {
      cid: cid.toString(),
      filename: file.name,
      size: file.size,
      type: file.type,
      url: `https://w3s.link/ipfs/${cid}`,
      uploadedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error uploading file to Storacha:", error);
    throw new Error("Failed to upload file: " + error.message);
  }
}

/**
 * Create a shareable link with UCAN permissions
 * @param {Client} client - Authenticated Storacha client
 * @param {Object} params - Link parameters
 * @param {string} params.cid - Content ID to share
 * @param {string} params.permission - Permission level (read/download/edit)
 * @param {number} [params.expiration] - Optional expiration timestamp (in seconds)
 * @returns {Promise<Object>} Shareable link data
 */

/**
 * Create a shareable link with UCAN permissions
 */
export async function createShareableLink(
  client,
  { cid, permission, expiration }
) {
  try {
    // Validate CID format
    if (!cid || typeof cid !== "string" || !cid.startsWith("baf")) {
      throw new Error("Invalid CID format");
    }

    // Get current space
    const space = client.currentSpace();
    if (!space) {
      throw new Error("No current space configured");
    }

    // Create capabilities array
    const capabilities = [
      {
        can: "store/*",
        with: space.did(),
      },
    ];

    // Add download capability if needed
    if (permission === "download" || permission === "edit") {
      capabilities.push({
        can: "filecoin/claim",
        with: space.did(),
      });
    }

    // Add edit capability if needed
    if (permission === "edit") {
      capabilities.push({
        can: "store/remove",
        with: space.did(),
      });
    }

    // Create delegation
    const delegation = await Delegation.create({
      issuer: client.agent(), // The signing authority
      audience: "*", // Public delegation
      capabilities,
      expiration: expiration ? new Date(expiration * 1000) : undefined,
      proofs: client.proofs([]), // Empty proofs array
    });

    // Archive and encode the delegation
    const archive = await delegation.archive();
    const proof = Buffer.from(archive).toString("base64url");

    // Construct shareable URL
    const shareUrl = `https://share.storacha.net/#${cid}?ucan=${proof}`;

    return {
      url: shareUrl,
      cid,
      permission,
      expiration: expiration || null,
    };
  } catch (error) {
    console.error("Error creating shareable link:", error);
    throw new Error("Failed to create shareable link: " + error.message);
  }
}
