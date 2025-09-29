import React from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

export function WalletButton() {
	const { address, isConnected } = useAccount()
	const { connect, isPending } = useConnect({ connector: injected() })
	const { disconnect } = useDisconnect()

	if (!isConnected) return <button onClick={() => connect()} disabled={isPending}>Connect Wallet</button>
	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
			<span>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
			<button onClick={() => disconnect()}>Disconnect</button>
		</div>
	)
}
