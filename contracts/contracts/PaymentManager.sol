// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ZetaChain protocol contracts (to be installed in contracts package.json):
// import "@zetachain/protocol-contracts/contracts/zevm/SystemContract.sol";
// import "@zetachain/protocol-contracts/contracts/zevm/interfaces/IZRC20.sol";

/**
 * Omnichain-capable payment manager. Emits request/fulfilled events and
 * will integrate ZetaChain omnichain settlement for cross-chain payments.
 */
contract PaymentManager {
    struct PaymentRequest {
        address requester;
        uint256 amount;
        address token; // preferred token
        bool fulfilled;
    }

    uint256 public requestCount;
    mapping(uint256 => PaymentRequest) public requests;

    event PaymentRequested(
        uint256 requestId,
        address indexed requester,
        uint256 amount,
        address token
    );
    event PaymentFulfilled(
        uint256 requestId,
        address indexed payer,
        address token,
        uint256 amount
    );

    function createRequest(
        uint256 _amount,
        address _token
    ) external returns (uint256) {
        require(_amount > 0, "Invalid amount");
        requestCount++;
        requests[requestCount] = PaymentRequest({
            requester: msg.sender,
            amount: _amount,
            token: _token,
            fulfilled: false
        });
        emit PaymentRequested(requestCount, msg.sender, _amount, _token);
        return requestCount;
    }

    function fulfillRequest(
        uint256 _requestId,
        address _token,
        uint256 _amount
    ) external payable {
        PaymentRequest storage req = requests[_requestId];
        require(req.requester != address(0), "Invalid request");
        require(!req.fulfilled, "Already paid");

        // TODO (omnichain): integrate ZetaChain omnichain settlement here.
        // Intended flow:
        // - If payer is on a different chain or using a different token than req.token,
        //   trigger ZetaChain cross-chain settlement to deliver req.token to req.requester
        //   on the destination chain.
        // - On destination, receive message and complete settlement using IZRC20/SystemContract.
        // - Update request status accordingly and emit events.

        // For now, only allow native token payment if token == address(0)
        if (req.token == address(0)) {
            require(_token == address(0), "Token mismatch");
            require(msg.value == req.amount, "Incorrect ETH amount");
            (bool sent, ) = payable(req.requester).call{value: msg.value}("");
            require(sent, "Transfer failed");
        } else {
            // Accept as a signal only; in production integrate ERC20 transfer + ZetaConnector
            require(_token == req.token, "Token mismatch");
            require(_amount == req.amount, "Incorrect token amount");
        }

        req.fulfilled = true;
        emit PaymentFulfilled(_requestId, msg.sender, _token, _amount);
    }
}


