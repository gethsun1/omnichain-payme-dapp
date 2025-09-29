# Architecture

```mermaid
flowchart LR
  subgraph Frontend
    A[Create Request Page]
    B[Pay Request Page]
    C[Dashboard]
  end

  A -- createRequest --> PM[(PaymentManager Contract)]
  B -- fulfillRequest --> PM

  subgraph ZetaChain
    ZC[Zeta Connector / SystemContract]
  end

  PM -- cross-chain message --> ZC
  ZC -- deliver/settle --> DestChain[(Destination Chain Token Delivery)]

  C -- read events --> PM
```

Components:
- PaymentManager: creates/fulfills requests, emits events, integrates ZetaChain for settlement
- ZetaChain: transports cross-chain messages and assets; settles preferred token on destination chain
- Frontend: UX for creating, paying, and tracking requests
