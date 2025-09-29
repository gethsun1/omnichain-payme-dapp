import React from 'react'
import { Link, Outlet } from 'react-router-dom'

export function App() {
	return (
		<div style={{ fontFamily: 'sans-serif', margin: '1rem auto', maxWidth: 800 }}>
			<nav style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
				<Link to="/create">Create</Link>
				<Link to="/dashboard">Dashboard</Link>
			</nav>
			<Outlet />
		</div>
	)
}
