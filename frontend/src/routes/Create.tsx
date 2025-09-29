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
	const { createRequest, waitForReceipt, getRequestCount } = usePaymentManager()

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		try {
			const hash = await createRequest(parseEther(amount), token as `0x${string}`)
			await waitForReceipt(hash)
			const count = await getRequestCount()
			const id = count.toString()
			setRequestId(id)
			const link = `${window.location.origin}/pay/${id}`
			const dataUrl = await QRCode.toDataURL(link)
			setQr(dataUrl)
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
					<div>Request ID: {requestId}</div>
					<div>Link: <a href={`/pay/${requestId}`}>{window.location.origin}/pay/{requestId}</a></div>
					{qr && <img src={qr} alt="QR" style={{ width: 200 }} />}
				</div>
			)}
		</div>
	)
}
