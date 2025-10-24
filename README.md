# QuorumNetwork

This repository contains the setup and configuration for a Quorum blockchain network.

## 🏗️ Components
- **Member Nodes (Quorum + Tessera)**: Run QBFT consensus with privacy support.
- **RPC Node**: Provides JSON-RPC API access.
- **Prometheus & Grafana**: For network metrics and visualization.
- **Docker Compose**: Used to orchestrate all services in the network.

## 🚀 Getting Started
```bash
git clone https://github.com/syushen92/QuorumNetwork.git
cd QuorumNetwork
docker compose up -d
