import { useMemo } from 'react'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { PAYMENT_MANAGER_ADDRESS, ZETA_ATHENS_CHAIN_ID } from '../config'
import { paymentManagerAbi } from '../abi/PaymentManager'
import { Address } from 'viem'

export function usePaymentManager() {
	const publicClient = usePublicClient({ chainId: ZETA_ATHENS_CHAIN_ID })
	const { data: walletClient } = useWalletClient()
	const { address } = useAccount()

	const contract = useMemo(() => ({
		address: PAYMENT_MANAGER_ADDRESS[ZETA_ATHENS_CHAIN_ID] as Address,
		abi: paymentManagerAbi,
		chainId: ZETA_ATHENS_CHAIN_ID,
	}), [])

	async function createRequest(amountWei: bigint, token: Address) {
		if (!walletClient) throw new Error('No wallet client')
		return walletClient.writeContract({ ...contract, functionName: 'createRequest', args: [amountWei, token] })
	}

	async function fulfillRequest(requestId: bigint, token: Address, amountWei: bigint, valueWei?: bigint) {
		if (!walletClient) throw new Error('No wallet client')
		return walletClient.writeContract({ ...contract, functionName: 'fulfillRequest', args: [requestId, token, amountWei], value: valueWei })
	}

	async function getRequest(id: bigint) {
		return publicClient!.readContract({ ...contract, functionName: 'requests', args: [id] })
	}

	async function getRequestCount() {
		return publicClient!.readContract({ ...contract, functionName: 'requestCount', args: [] }) as Promise<bigint>
	}

	return { address, createRequest, fulfillRequest, getRequest, getRequestCount, contract }
}
