// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Minimal interfaces for ZetaChain Athens SystemContract and ZRC20 (to avoid adding deps now)
interface IZRC20Like {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function decimals() external view returns (uint8);
}

interface ISystemContractLike {
    struct RevertOptions {
        address revertAddress;
        bytes revertMessage;
    }

    function withdraw(
        bytes calldata receiver,
        uint256 amount,
        address zrc20,
        RevertOptions calldata revertOptions
    ) external;
}

/**
 * Omnichain-capable payment manager. Emits request/fulfilled events and
 * will integrate ZetaChain omnichain settlement for cross-chain payments.
 */
contract PaymentManager {
    // Zeta Athens SystemContract on ZEVM
    address public immutable systemContract;

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

    constructor(address _systemContract) {
        require(_systemContract != address(0), "invalid system");
        systemContract = _systemContract;
    }

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
            // ZRC-20 path on Athens: pull ZRC-20 from payer to this contract,
            // approve SystemContract, and withdraw to requester on destination (ZEVM or external chain via gateway).
            require(_token == req.token, "Token mismatch");
            require(_amount == req.amount, "Incorrect token amount");

            // Transfer ZRC20 into this contract
            require(IZRC20Like(_token).transferFrom(msg.sender, address(this), _amount), "zrc20 transferFrom failed");
            // Approve SystemContract to withdraw
            require(IZRC20Like(_token).approve(systemContract, _amount), "approve failed");

            // Encode EVM address as bytes for receiver
            bytes memory receiver = abi.encodePacked(req.requester);
            ISystemContractLike.RevertOptions memory ro = ISystemContractLike.RevertOptions({
                revertAddress: msg.sender,
                revertMessage: "withdraw revert"
            });
            ISystemContractLike(systemContract).withdraw(receiver, _amount, _token, ro);
        }

        req.fulfilled = true;
        emit PaymentFulfilled(_requestId, msg.sender, _token, _amount);
    }
}


