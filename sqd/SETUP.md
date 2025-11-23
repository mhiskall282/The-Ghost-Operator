# SQD Indexer for Ghost Bot

This SQD indexer tracks payment history on Polygon to create Worker Reputation Scores for the Ghost Bot autonomous agent system.

## Features

- 📊 **Payment Tracking**: Indexes all bounty payments from the Ghost Bot smart contract
- 👤 **Worker Profiles**: Maintains comprehensive worker statistics and earnings
- 🏆 **Reputation Scoring**: Calculates reputation scores based on task completion, earnings, and consistency
- 📈 **Analytics**: Daily statistics and payment trends
- 🔍 **GraphQL API**: Query payment history and worker reputation

## Architecture

- **SQD Network**: Provides fast access to historical Polygon blockchain data
- **EvmBatchProcessor**: Efficiently processes payment events in batches
- **TypeORM**: Stores indexed data in PostgreSQL
- **GraphQL Server**: Exposes data through a flexible API

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose (for local development)
- PostgreSQL 15+ (if not using Docker)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update the configuration in `src/constants.ts`:
   - Set `GHOST_BOUNTY_CONTRACT` to your deployed contract address
   - Update the block number in `src/processor.ts` to your contract deployment block

### Development

#### Using Docker (Recommended)

Start all services (PostgreSQL, processor, and GraphQL server):

```bash
docker-compose up -d
```

View logs:
```bash
docker-compose logs -f processor
docker-compose logs -f graphql
```

#### Local Development

1. Start PostgreSQL:
```bash
docker-compose up -d postgres
```

2. Generate TypeORM models from schema:
```bash
npm run build
```

3. Run database migrations:
```bash
npm run db:migrate
```

4. Start the processor:
```bash
npm run process
```

5. In another terminal, start the GraphQL server:
```bash
npm run serve
```

## GraphQL API

Once running, access the GraphQL playground at: `http://localhost:4350/graphql`

### Example Queries

#### Get Worker Reputation
```graphql
query {
  workers(orderBy: reputationScore_DESC, limit: 10) {
    id
    totalEarned
    totalTasksCompleted
    successRate
    reputationScore
    lastPaymentAt
    payments(limit: 5, orderBy: timestamp_DESC) {
      amount
      taskType
      timestamp
      transactionHash
    }
  }
}
```

#### Get Payment History
```graphql
query {
  payments(
    where: { worker: { id_eq: "0x..." } }
    orderBy: timestamp_DESC
    limit: 20
  ) {
    id
    amount
    token
    status
    taskType
    taskDescription
    timestamp
    transactionHash
    worker {
      id
      reputationScore
    }
  }
}
```

#### Get Daily Statistics
```graphql
query {
  dailyStats(orderBy: date_DESC, limit: 30) {
    date
    totalPayments
    paymentCount
    uniqueWorkers
    averagePayment
  }
}
```

#### Top Earners
```graphql
query {
  workers(orderBy: totalEarned_DESC, limit: 10) {
    id
    totalEarned
    totalTasksCompleted
    reputationScore
  }
}
```

## Reputation Score Algorithm

The reputation score (0-100) is calculated based on:

1. **Task Completion (40%)**: Number of successfully completed tasks
2. **Total Earnings (30%)**: Total amount earned (normalized)
3. **Success Rate (20%)**: Percentage of successful vs failed payments
4. **Consistency (10%)**: Regularity of task completion over time

## Deployment

### Deploy to SQD Cloud

1. Install SQD CLI:
```bash
npm i -g @subsquid/cli
```

2. Authenticate:
```bash
sqd auth
```

3. Deploy:
```bash
sqd deploy .
```

### Self-Hosted Deployment

Use the provided `docker-compose.yml` for production deployment:

```bash
docker-compose up -d
```

For production, consider:
- Using managed PostgreSQL (AWS RDS, Google Cloud SQL, etc.)
- Setting up monitoring (Prometheus, Grafana)
- Configuring backups
- Using a reverse proxy (nginx, Caddy)

## Configuration

### Environment Variables

- `DB_NAME`: PostgreSQL database name
- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port
- `DB_USER`: PostgreSQL user
- `DB_PASS`: PostgreSQL password
- `RPC_ENDPOINT`: Polygon RPC endpoint for real-time data (optional)
- `GQL_PORT`: GraphQL server port (default: 4350)

### Contract Configuration

Update `src/constants.ts`:

```typescript
export const GHOST_BOUNTY_CONTRACT = '0xYourContractAddress'
```

Update `src/processor.ts`:

```typescript
.setBlockRange({ 
  from: YOUR_DEPLOYMENT_BLOCK_NUMBER
})
```

## Troubleshooting

### Database Connection Issues

Ensure PostgreSQL is running and credentials are correct in `.env`.

### Processor Not Syncing

1. Check that the contract address is correct
2. Verify the deployment block number
3. Check processor logs: `docker-compose logs processor`

### GraphQL Server Not Starting

1. Ensure database migrations have been run
2. Check GraphQL server logs: `docker-compose logs graphql`

## Integration with Ghost Bot

The SQD indexer provides reputation data to the Ghost Bot agent through the GraphQL API:

1. **Worker Verification**: Check if a worker has a good reputation before assigning tasks
2. **Payment History**: View a worker's complete payment history
3. **Analytics Dashboard**: Display payment trends and top performers
4. **Reputation Gating**: Only allow high-reputation workers for premium tasks

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Resources

- [SQD Documentation](https://docs.sqd.ai/)
- [Squid SDK Examples](https://github.com/subsquid/squid-sdk)
- [GraphQL Documentation](https://graphql.org/learn/)
