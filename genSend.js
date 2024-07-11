require("dotenv").config();
const express = require("express");
const { generateKeyPairSync } = require("crypto");
const crypto = require("crypto");
const fs = require("fs");

const app = express();

const port = process.env.PORT || 4002;
const passPhrase = process.env.PASSPHRASE;

app.use(express.json());

app.post("/api/pem_gen", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) return res.status(400).json({ msg: "Message is required" });

    const { privateKey, publicKey } = createRSA(passPhrase);

    const encryptedMsg = crypto
      .publicEncrypt(publicKey, Buffer.from(message))
      .toString("base64");

    // Sign the message
    const sign = crypto.createSign("SHA256");
    sign.update(encryptedMsg);
    sign.end();

    const signature = sign.sign(
      { key: privateKey, passphrase: passPhrase },
      "base64"
    );

    return res.status(200).json({ msg: "Successfully signed", signature });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

const createRSA = (passphrase) => {
  // Define filenames for the keys
  const publicKeyFile = "public_key_route.pem";
  const privateKeyFile = "private_key_route.pem";

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

  return { publicKey, privateKey };
};

app.listen(port, () =>
  console.log(`Server running on port http://127.0.1:${port}/api/pem_gen`)
);
