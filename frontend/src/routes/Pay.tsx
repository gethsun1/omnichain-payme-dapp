import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { parseEther } from 'viem'
import { usePaymentManager } from '../hooks/usePaymentManager'
import { ZERO_ADDRESS } from '../config'

export function Pay() {
	const { id } = useParams()
	const { fulfillRequest } = usePaymentManager()
	const [amount, setAmount] = useState('0.01')
	const [loading, setLoading] = useState(false)

	async function onPay() {
		if (!id) return
		setLoading(true)
		try {
			await fulfillRequest(BigInt(id), ZERO_ADDRESS as `0x${string}`, parseEther(amount), parseEther(amount))
			alert('Paid (stub)')
		} catch (e) {
			console.error(e)
			alert('Payment failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div>
			<h2>Pay Request</h2>
			<div>Request ID: {id}</div>
			<label>
				Amount (ETH)
				<input value={amount} onChange={(e) => setAmount(e.target.value)} />
			</label>
			<button onClick={onPay} style={{ marginTop: 12 }} disabled={loading}>{loading ? 'Paying...' : 'Pay Now'}</button>
		</div>
	)
}
