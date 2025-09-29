import React, { useState } from 'react'
import QRCode from 'qrcode'
import { parseEther } from 'viem'
import { ZERO_ADDRESS } from '../config'
import { usePaymentManager } from '../hooks/usePaymentManager'

export function Create() {
	const [amount, setAmount] = useState('')
	const [token, setToken] = useState(ZERO_ADDRESS)
	const [requestId, setRequestId] = useState<string | null>(null)
	const [qr, setQr] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const { createRequest } = usePaymentManager()

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		try {
			const txHash = await createRequest(parseEther(amount), token as `0x${string}`)
			// naive: read current requestCount after tx mined; for now, assume increment and reload
			const link = `${window.location.origin}/pay/last` // placeholder; user can use dashboard
			const dataUrl = await QRCode.toDataURL(link)
			setQr(dataUrl)
			setRequestId('created')
		} catch (e) {
			console.error(e)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div>
			<h2>Create Request</h2>
			<form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
				<label>
					Amount (ETH)
					<input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.01" />
				</label>
				<label>
					Preferred Token (address)
					<input value={token} onChange={(e) => setToken(e.target.value)} />
				</label>
				<button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
			</form>
			{requestId && (
				<div style={{ marginTop: 16 }}>
					<div>Request created.</div>
					{qr && <img src={qr} alt="QR" style={{ width: 200 }} />}
				</div>
			)}
		</div>
	)
}
