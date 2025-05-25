import * as Client from "@web3-storage/w3up-client";
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
 * Generate a shareable UCAN link
 * @param {Client} client - Authenticated Storacha client
 * @param {Object} options
 * @param {string} options.cid - Content ID to share
 * @param {'read'|'download'|'edit'} options.permission
 * @param {number} [options.expiration] - Unix timestamp (seconds)
 * @returns {Promise<{url: string, permission: string, expiration?: number, ucan: string}>}
 */

export default async function createShareableLink(client, {cid , permission, expiration}) {
  try {
    const capability = `store/${permission}`;

    const delegation = await client.createDelegation({
      audience: "*", //public delegation (open to all)
      abilities: [capability],
      resource: `storage://${cid}`,
      expiration: expiration || undefined,
    });

    const ucanToken = await delegation.export();
    
    return {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/share/${ucanToken}`,
      permission,
      expiration: expiration || undefined,
      ucan: ucanToken,
    };
  } catch (error) {
    console.error("Error creating shareable link", error);
    throw new Error("Failed to create share link" + error.message);
  }
}
