import * as Client from "@web3-storage/w3up-client";
import { StoreMemory } from "@web3-storage/w3up-client/stores/memory";
import { Signer } from "@web3-storage/w3up-client/principal/ed25519";
import * as DID from '@ipld/dag-ucan/did'
import * as Delegation from '@ucanto/core/delegation'
import * as Link from 'multiformats/link'
import * as Proof from "@web3-storage/w3up-client/proof";

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
  * Grant the capabilities access to a particular DID (user) for a particular space.
 * @param {*} client - Authenticated Storacha client
 * @param {*} deadline - Till when is the shared user allowed to view the file
 * @returns {Boolean} true -> access revoked / false -> An error occurs
 */


export async function ShareFile(client, deadline, clientDid){
  try{
  const spaceDid=client.agent.did();
  console.log("THe space did is", spaceDid);
  console.log("The client did is", clientDid, deadline)
  const audience = DID.parse(clientDid);
  const authorizer=client.agent;
  console.log("Trying to revoke the file acess");
  const abilities = ['upload/add', 'upload/get','upload/remove'];
  const capabilities=abilities.map((cap)=>{
    return {
      with: `${spaceDid}`,
      can: cap,
    }
  })
  const ucan = await Delegation.delegate({
    issuer: authorizer.issuer,
    audience,
    capabilities,
    expiration:deadline
  }) 
  const archive = await ucan.archive()
  console.log("The ucan cid is",ucan.cid);
  console.log(archive.ok)
  return archive.ok
  }catch(error){
    console.error("Error sharing file access priviliges:", error);
    return false;
  }   
}