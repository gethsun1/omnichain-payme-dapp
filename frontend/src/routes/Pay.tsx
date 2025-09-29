import React from 'react'
import { useParams } from 'react-router-dom'

export function Pay() {
	const { id } = useParams()

	async function onPay() {
		// TODO: read request details from contract and call fulfillRequest
		alert(`Paying request ${id} (stub)`) 
	}

	return (
		<div>
			<h2>Pay Request</h2>
			<div>Request ID: {id}</div>
			<button onClick={onPay} style={{ marginTop: 12 }}>Pay Now</button>
		</div>
	)
}
