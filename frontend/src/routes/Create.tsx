import React, { useMemo, useState } from 'react'
import QRCode from 'qrcode'

export function Create() {
	const [amount, setAmount] = useState('')
	const [token, setToken] = useState('0x0000000000000000000000000000000000000000')
	const [requestId, setRequestId] = useState<string | null>(null)
	const [qr, setQr] = useState<string | null>(null)

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		// TODO: call contract createRequest and capture requestId
		const newId = '1'
		setRequestId(newId)
		const link = `${window.location.origin}/pay/${newId}`
		const dataUrl = await QRCode.toDataURL(link)
		setQr(dataUrl)
	}

	return (
		<div>
			<h2>Create Request</h2>
			<form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
				<label>
					Amount
					<input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.01" />
				</label>
				<label>
					Preferred Token (address)
					<input value={token} onChange={(e) => setToken(e.target.value)} />
				</label>
				<button type="submit">Create</button>
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
