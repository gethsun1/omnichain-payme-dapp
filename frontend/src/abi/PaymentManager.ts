export const paymentManagerAbi = [
	{
		"anonymous": false,
		"inputs": [
			{ "indexed": false, "internalType": "uint256", "name": "requestId", "type": "uint256" },
			{ "indexed": true, "internalType": "address", "name": "payer", "type": "address" },
			{ "indexed": false, "internalType": "address", "name": "token", "type": "address" },
			{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
		],
		"name": "PaymentFulfilled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{ "indexed": false, "internalType": "uint256", "name": "requestId", "type": "uint256" },
			{ "indexed": true, "internalType": "address", "name": "requester", "type": "address" },
			{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
			{ "indexed": false, "internalType": "address", "name": "token", "type": "address" }
		],
		"name": "PaymentRequested",
		"type": "event"
	},
	{
		"inputs": [
			{ "internalType": "uint256", "name": "_amount", "type": "uint256" },
			{ "internalType": "address", "name": "_token", "type": "address" }
		],
		"name": "createRequest",
		"outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{ "internalType": "uint256", "name": "_requestId", "type": "uint256" },
			{ "internalType": "address", "name": "_token", "type": "address" },
			{ "internalType": "uint256", "name": "_amount", "type": "uint256" }
		],
		"name": "fulfillRequest",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "requestCount",
		"outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
		"name": "requests",
		"outputs": [
			{ "internalType": "address", "name": "requester", "type": "address" },
			{ "internalType": "uint256", "name": "amount", "type": "uint256" },
			{ "internalType": "address", "name": "token", "type": "address" },
			{ "internalType": "bool", "name": "fulfilled", "type": "bool" }
		],
		"stateMutability": "view",
		"type": "function"
	}
] as const;
