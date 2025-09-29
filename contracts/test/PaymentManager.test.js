const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PaymentManager", function () {
  it("creates a request and fulfills with native token", async function () {
    const [requester, payer] = await ethers.getSigners();
    const PaymentManager = await ethers.getContractFactory("PaymentManager");
    const paymentManager = await PaymentManager.connect(requester).deploy();
    await paymentManager.waitForDeployment();

    const amount = ethers.parseEther("0.01");
    const tx = await paymentManager.connect(requester).createRequest(amount, ethers.ZeroAddress);
    const receipt = await tx.wait();

    const requestId = await paymentManager.requestCount();
    const req = await paymentManager.requests(requestId);
    expect(req.requester).to.equal(requester.address);
    expect(req.amount).to.equal(amount);
    expect(req.token).to.equal(ethers.ZeroAddress);
    expect(req.fulfilled).to.equal(false);

    const payTx = await paymentManager
      .connect(payer)
      .fulfillRequest(requestId, ethers.ZeroAddress, amount, { value: amount });
    await payTx.wait();

    const reqAfter = await paymentManager.requests(requestId);
    expect(reqAfter.fulfilled).to.equal(true);
  });
});


