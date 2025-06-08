import * as Client from "@web3-storage/w3up-client";
import { StoreMemory } from "@web3-storage/w3up-client/stores/memory";
import * as Proof from "@web3-storage/w3up-client/proof";
import { Signer } from "@web3-storage/w3up-client/principal/ed25519";
import * as Link from 'multiformats/link'
import * as DID from '@ipld/dag-ucan/did'
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
 * Revoke file access from storacha
 * @param {Client} client - Authenticated Storacha client
 * @param {string } contentCID the string of the format "baf...."
 * @returns {Boolean} true -> access revoked / false -> An error occurs
 */

export async function RevokeFileAccess(client, contentCID){
  try{
    console.log("Trying to revoke the file acess");
   const parsedCidToBeRemoved=Link.parse(contentCID);
   await client.remove(parsedCidToBeRemoved, { shards: true });
   return true
  }catch(error){
    console.error("Error removing file from Storacha:", error);
    return false;
  }   
}

/**
 * Grant access of the file to a particular DID (user).
 * @param {*} client - Authenticated Storacha client
 * @param {*} deadline - Till when is the shared user allowed to view the file
 * @returns {Boolean} true -> access revoked / false -> An error occurs
 */


export async function ShareFile(client, deadline, did){
  try{
  console.log("Trying to revoke the file acess");
  const audience = DID.parse(did);
  console.log("The user did is", audience);
  const abilities = ['space/blob/add', 'space/index/add', 'filecoin/offer', 'upload/add']
  const delegation = await client.createDelegation(audience, abilities, { deadline })
  const archive = await delegation.archive()
  return archive.ok
  }catch(error){
    console.error("Error removing file from Storacha:", error);
    return false;
  }   
}