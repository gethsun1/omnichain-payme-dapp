const { ethers } = require("hardhat");

async function main() {
  const PaymentManager = await ethers.getContractFactory("PaymentManager");
  const paymentManager = await PaymentManager.deploy();
  await paymentManager.waitForDeployment();
  console.log("PaymentManager deployed to:", await paymentManager.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


