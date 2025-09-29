import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, http, createConfig } from 'wagmi'
import { polygon, mainnet, zetachainAthensTestnet } from 'wagmi/chains'

import { App } from './routes/App'
import { Create } from './routes/Create'
import { Pay } from './routes/Pay'
import { Dashboard } from './routes/Dashboard'

const config = createConfig({
	chains: [mainnet, polygon, zetachainAthensTestnet],
	transports: {
		[mainnet.id]: http(),
		[polygon.id]: http(),
		[zetachainAthensTestnet.id]: http(),
	},
})

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{ path: '/', element: <Create /> },
			{ path: '/create', element: <Create /> },
			{ path: '/pay/:id', element: <Pay /> },
			{ path: '/dashboard', element: <Dashboard /> },
		],
	},
])

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</WagmiProvider>
	</React.StrictMode>
)
