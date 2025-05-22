# ShareBox - UCAN File Sharing Platform

ShareBox is a modern web application built with Next.js that enables secure file sharing using Storacha and UCANs (User Controlled Authorization Networks). It provides a simple interface for uploading files and sharing them with specific permissions.

## Features

- Secure file uploads to IPFS via Storacha
- Modern, responsive UI with Tailwind CSS
- Real-time upload status and feedback
- File validation and error handling
- IPFS gateway integration for easy file access
- UCAN-based authorization system

## Prerequisites

- npm or yarn
- Storacha account and credentials

## Setup

1. Clone the repository:

```bash
git clone https://github.com/Dhruv-Varshney-developer/ShareBox-Storacha
cd sharebox
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up Web3.Storage credentials:

First, install the Web3.Storage CLI:

```bash
npm install -g @web3-storage/w3cli
```

Then, generate your credentials:

```bash
# Login to Web3.Storage
w3 login your@email.com

# List your spaces
w3 space ls

# Use a space
w3 space use <space_did>

# Create a key and copy the output
w3 key create

# Create a delegation and copy the output
w3 delegation create <the_did_from_previous_step> --base64

# or if the output is truncated in terminal, add it to proof.txt and then copy it from there:
w3 delegation create <the_did_from_previous_step> --base64  >> proof.txt



```

4. Create a `.env.local` file in the root directory and add your Web3.Storage credentials:

```env
STORACHA_KEY=<your_key_from_w3_key_create>
STORACHA_PROOF=<your_delegation_from_w3_delegation_create>
```

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/components` - React components
- `/pages` - Next.js pages and API routes
- `/lib` - Utility functions and Web3.Storage client setup
- `/styles` - CSS modules and global styles
- `/utils` - Helper functions

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [Storacha](https://docs.storacha.network/) - Decentralized storage
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
