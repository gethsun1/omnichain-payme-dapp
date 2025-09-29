const { ethers } = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();
  const address = await signer.getAddress();
  const balance = await ethers.provider.getBalance(address);
  console.log("Deployer:", address);
  console.log("Balance (wei):", balance.toString());
  console.log("Balance (ETH):", ethers.formatEther(balance));
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
