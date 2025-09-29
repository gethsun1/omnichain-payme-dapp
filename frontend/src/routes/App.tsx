import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { WalletButton } from '../wallet'

export function App() {
	return (
		<div style={{ fontFamily: 'sans-serif', margin: '1rem auto', maxWidth: 800 }}>
			<nav style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', justifyContent: 'space-between' }}>
				<div style={{ display: 'flex', gap: 12 }}>
					<Link to="/create">Create</Link>
					<Link to="/dashboard">Dashboard</Link>
				</div>
				<WalletButton />
			</nav>
			<Outlet />
		</div>
	)
}
