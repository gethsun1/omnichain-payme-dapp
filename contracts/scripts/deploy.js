const { ethers } = require("hardhat");

async function main() {
  const PaymentManager = await ethers.getContractFactory("PaymentManager");
  const systemContract = process.env.ZETA_SYSTEM_CONTRACT || "0xEdf1c3275d13489aCdC6cD6eD246E72458B8795B";
  const paymentManager = await PaymentManager.deploy(systemContract);
  await paymentManager.waitForDeployment();
  console.log("PaymentManager deployed to:", await paymentManager.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


