const { generateKeyPairSync } = require("crypto");
const fs = require("fs");


let passphrase = process.env.passphrase;

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  // encrypts the private key using the aes-256-cbc cipher with the passphrase specified in process.env.passphrase.
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
    cipher: "aes-256-cbc",
    passphrase: `${passphrase}`,
  },
});

// Define filenames for the keys
const publicKeyFile = "public_key.pem";
const privateKeyFile = "private_key.pem";

// Write public key to a file
fs.writeFile(publicKeyFile, publicKey, (err) => {
  if (err) {
    console.error("Error writing public key:", err);
  } else {
    console.log("Public key written to", publicKeyFile);
  }
});

// Write private key to a file
fs.writeFile(privateKeyFile, privateKey, (err) => {
  if (err) {
    console.error("Error writing private key:", err);
  } else {
    console.log("Private key written to", privateKeyFile);
  }
});
