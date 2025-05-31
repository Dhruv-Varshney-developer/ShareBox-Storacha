# 📦 ShareBox - UCAN File Sharing Platform

**ShareBox** is a modern web application built with **Next.js** that enables **secure file sharing** using **Storacha** and **UCANs** (User Controlled Authorization Networks). It provides a simple interface for uploading files and sharing them with specific permissions.

---

### TL;DR for Beginners 🧑‍💻

**What this does:** You upload a file through the frontend → it gets processed and sent to Storacha → you get a **CID** to access the file later.

---

## 🌟 Features

* 🔐 Secure file uploads to IPFS via Storacha
* 💡 UCAN-based authorization system
* 🔗 IPFS gateway integration for file access

---

## ⚙️ Prerequisites

* Node.js (v16+)
* npm or yarn
* A Web3.Storage account

---

## 🚀 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Dhruv-Varshney-developer/ShareBox-Storacha
cd ShareBox-Storacha
```

---

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

---

### 3. Set up Web3.Storage credentials

Install the Web3.Storage CLI:

```bash
npm install -g @web3-storage/w3cli
```

Then follow the steps below to generate and link your credentials:

```bash
# Log in
w3 login your@email.com

# List spaces
w3 space ls

# Select space
w3 space use <space_did>

# Create agent key (copy the output)
w3 key create

# Create delegation from space to agent (copy output or save in proof.txt)
w3 delegation create <the_did_from_key_create> --base64 >> proof.txt
```

📎 **Attach image snippet** showing CLI output here.
🗂 **File**: `w3cli-setup.png`

---

### 4. Create `.env` file

In the root of your project:

```env
STORACHA_KEY=<your_key_from_w3_key_create>
STORACHA_PROOF=<your_delegation_from_w3_delegation_create>
```
---

## 🗂 Step 1: Configure Environment Keys

You'll need to securely store your private Storacha credentials in a file named `.env `.

Example:

```env
# .env
STORACHA_KEY="MgCaNVLZHF8........SO_ON"
STORACHA_PROOF="mAYIEAIMOEaJlcm9vd.....SO_ON"
```

_____

## Uploading Files to Storacha (2 Ways)

There are two ways you can upload files to your Storacha space:

1. **Backend Upload (less preferred)**
   Upload file → Send it to your server → Server uploads to Storacha.

2. **UCAN Delegated Upload (recommended)**
   Give the user a **secure upload token** → User uploads **directly** to Storacha.

>  In this project, we’ll use the **delegation method**.

---

## Step 2: Delegate Upload Permission to the User

To let your user upload files securely, we **delegate upload rights** from your backend to the user's browser. An easier way to understand this:

---

## Backend Code — Set Up the Upload Client

**File:** `lib/storacha.js`
This code sets up and authorizes a client with your private keys so it can delegate permissions.

```js
import * as Client from "@web3-storage/w3up-client";
import { StoreMemory } from "@web3-storage/w3up-client/stores/memory";
import * as Proof from "@web3-storage/w3up-client/proof";
import { Signer } from "@web3-storage/w3up-client/principal/ed25519";

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
```

 **What this does:**

* Loads your secret keys from `.env`
* Authenticates a Storacha client
* Grants it permission to upload on your behalf

---


## Frontend: Uploading the File

Once your backend gives permission, the **frontend can let users upload** using a simple file input.

 **File:** `components/FileUploader.js`

 **What it does:**

* Let users pick a file
* Validate it (only PDFs allowed)
* Send it to your backend for upload


 **After upload**,we show the user:

* A success message
* A link to their uploaded file

---

###  Preparing Files for Upload to Storacha

We support **two methods** of uploading files:

1. **`uploadFile`** – Requires a [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) input (used when uploading individual files).
2. **`uploadDirectory`** – Requires a `File`-like object (used for folders or multi-file structures).

> **In this guide, we’ll use `uploadFile` to upload a single file to Storacha.**

---

###  Upload Flow (Backend)

**File**: `/pages/api/upload.js`

Here’s how the backend handles your uploaded file:

1. **Receives the form-data** from the frontend using the `formidable` library.
2. **Extracts the uploaded file** from the request.
3. **Reads the file** from temporary storage.
4. **Validates the file** to ensure it's safe to upload.
5. **Initializes the Storacha client**.
6. **Uploads the file** using `uploadFileToStoracha`.
7. **Cleans up** the temporary file and returns the **CID** (Content Identifier) on success.

####  Here's what happens step-by-step:
```js
// Parse multipart form data sent from the frontend
const form = formidable({ ... });

// Extract fields and file(s)
const [fields, files] = await new Promise((resolve, reject) => {
  form.parse(req, (err, fields, files) => { ... });
});

// Read and validate the file
const fileContent = fs.readFileSync(uploadedFile.filepath);
const file = new File([fileContent], uploadedFile.originalFilename);

// Validate the file before uploading
const validation = validateFile(file);
if (!validation.isValid) return errorResponse(...);

// Upload to Storacha
const client = await initStorachaClient();
const uploadResult = await uploadFileToStoracha(client, file);

// Clean up and respond
fs.unlinkSync(uploadedFile.filepath);
return res.status(200).json({ success: true, data: uploadResult });
```

#### ✅ Success response:

```json
{
  "success": true,
  "data": {
    "cid": "bafybeigdyrv..."
  }
}
```

**Upload Function**
```js
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
```

 **Attached Screenshot:**
![alt text](</sharebox/public/finalImage.png>)

---

## Project Structure Overview

```
📁 components - React components
📁 pages - Next.js pages and API routes
📁 lib - Utility functions and Web3.Storage client setup
📁 styles - CSS modules and global styles
📁 utils - Helper functions
```

---

## ⚙️ Technologies Used

| Tech        | Purpose                                   |
| ----------- | ----------------------------------------- |
| 🧪 Next.js  | Frontend + API routes                     |
| 💾 Storacha | Decentralized file storage                |
| 🌀 Tailwind | Styling (utility-first CSS framework)     |
| 🔑 UCAN     | Authorization protocol (capability-based) |

---

## 🤝 Want to Contribute?

Pull requests are welcome!
Open an issue if you want to propose a big feature or change before working on it.

---

## 📄 License

Licensed under the [MIT License](LICENSE).


---

