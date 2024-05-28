const { generateKeyPairSync } = require("crypto");
const fs = require("fs");


let passphrase = "!Qsuzik#2w3e4r$T+/-5y6u7~@i8O9p0";

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
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
