# QuorumNetwork

This project provides a ready-to-use Quorum blockchain network with privacy (Tessera) and monitoring (Prometheus & Grafana), managed by Docker Compose and shell scripts.

## Project Structure

```
.
├── docker-compose.yml      # Main Compose config
├── run.sh                  # Start the network
├── stop.sh                 # Stop the network
├── resume.sh               # Resume stopped containers
├── remove.sh               # Remove all containers and data
├── logs/                   # Node logs
├── config/                 # Node keys and configs
├── smart_contracts/        # Contracts and deployment scripts
└── ...
```

## Requirements

- Docker & Docker Compose
- Bash

## Quick Start

Start the network with:
```bash
./run.sh
```

## Useful Commands

| Command         | Description                  |
| --------------- | --------------------------- |
| `./run.sh`      | Start the network           |
| `./stop.sh`     | Stop all services           |
| `./resume.sh`   | Resume stopped containers   |
| `./restart.sh`  | Restart the network         |
| `./remove.sh`   | Remove all data and containers |
| `./list.sh`     | Show service endpoints      |

## Notes

- All node data and logs are in `logs/` and `config/`.
- If you encounter issues, try `./remove.sh` then `./run.sh` again.
- Default RPC endpoint: [http://localhost:8545](http://localhost:8545)
- For contract deployment and advanced usage, see the `smart_contracts/` folder.