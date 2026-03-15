const crypto = require("crypto");

// Simple blockchain hash generation
function generateBlockHash(data, previousHash = "", nonce = 0) {
  const blockData = JSON.stringify({
    data,
    previousHash,
    nonce,
    timestamp: new Date().toISOString(),
  });

  return crypto.createHash("sha256").update(blockData).digest("hex");
}

// Proof of Work (simple mining)
function mineBlock(data, previousHash = "", difficulty = 2) {
  let nonce = 0;
  let hash = "";

  while (true) {
    hash = generateBlockHash(data, previousHash, nonce);

    // Check if hash starts with required zeros
    if (hash.substring(0, difficulty) === "0".repeat(difficulty)) {
      return { hash, nonce };
    }

    nonce++;
  }
}

// Verify blockchain integrity
function verifyBlockchain(chain) {
  for (let i = 1; i < chain.length; i++) {
    const currentBlock = chain[i];
    const previousBlock = chain[i - 1];

    // Verify current block hash
    const recalculatedHash = generateBlockHash(
      currentBlock.data,
      currentBlock.previousHash,
      currentBlock.nonce
    );

    if (recalculatedHash !== currentBlock.blockchainHash) {
      return false;
    }

    // Verify chain link
    if (currentBlock.previousHash !== previousBlock.blockchainHash) {
      return false;
    }
  }

  return true;
}

module.exports = {
  generateBlockHash,
  mineBlock,
  verifyBlockchain,
};
