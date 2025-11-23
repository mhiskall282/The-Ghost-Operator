# Ghost Bot SQD - Quick Reference

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env

# 3. Start PostgreSQL
docker-compose up -d postgres

# 4. Build and migrate
npm run build
npm run db:migrate

# 5. Start indexing
npm run process

# 6. Start GraphQL API (in another terminal)
npm run serve
```

## 📝 Essential Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run db:migrate` | Apply database migrations |
| `npm run db:create-migration` | Generate new migration |
| `npm run process` | Start the indexer processor |
| `npm run serve` | Start GraphQL server |
| `npm run serve:prod` | Start GraphQL (production mode) |
| `docker-compose up -d` | Start all services with Docker |
| `docker-compose logs -f processor` | View processor logs |

## 🔧 Configuration Checklist

- [ ] Update `GHOST_BOUNTY_CONTRACT` in `src/constants.ts`
- [ ] Set deployment block in `src/processor.ts`
- [ ] Configure `.env` with database credentials
- [ ] (Optional) Add `RPC_ENDPOINT` for real-time data
- [ ] Generate event topic hashes
- [ ] Test with sample data

## 📊 Key Files

```
sqd/
├── schema.graphql          # Data model definition
├── src/
│   ├── main.ts            # Event handlers & business logic
│   ├── processor.ts       # SQD processor configuration
│   ├── constants.ts       # Contract addresses & config
│   └── abi/               # Contract ABIs
├── docker-compose.yml     # Local development setup
├── squid.yaml             # SQD Cloud deployment config
└── SETUP.md               # Detailed setup guide
```

## 🎯 Common GraphQL Queries

### Check Worker Reputation
```graphql
query {
  worker(id: "0x...") {
    reputationScore
    totalEarned
    totalTasksCompleted
  }
}
```

### Recent Payments
```graphql
query {
  payments(orderBy: timestamp_DESC, limit: 10) {
    amount
    worker { id }
    timestamp
  }
}
```

### Leaderboard
```graphql
query {
  workers(orderBy: reputationScore_DESC, limit: 10) {
    id
    reputationScore
    totalEarned
  }
}
```

See `QUERIES.md` for more examples.

## 🔌 Integration Examples

### XMTP Bot Integration
```typescript
import { getWorkerReputation } from './sqd-integration'

const reputation = await getWorkerReputation(workerAddress)
if (reputation && reputation.reputationScore >= 70) {
  // Allow premium task
}
```

### Fluence Agent Integration
```rust
let eligible = check_worker_eligibility(
    worker_address,
    50.0, // min reputation
    5     // min tasks
);
```

See `examples/` folder for complete implementations.

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection failed | Check PostgreSQL is running and `.env` credentials |
| Processor stuck | Verify contract address and deployment block |
| No events indexed | Check event topic hashes match contract |
| GraphQL server won't start | Run `npm run db:migrate` first |
| Slow queries | Add database indexes on frequently queried fields |

## 📈 Reputation Score Ranges

| Score | Tier | Description |
|-------|------|-------------|
| 90-100 | ⭐⭐⭐ Elite | Premium tasks, 20% bonus |
| 75-89 | ⭐⭐ Advanced | Standard tasks, 10% bonus |
| 50-74 | ⭐ Intermediate | Basic tasks, no bonus |
| 0-49 | 🌱 Beginner | Entry tasks only |

## 🔗 Important Links

- [SQD Documentation](https://docs.sqd.ai/)
- [GraphQL Playground](http://localhost:4350/graphql)
- [Polygon Block Explorer](https://polygonscan.com/)
- [Project GitHub](https://github.com/mhiskall282/ghost-bot)

## 📋 Deployment Checklist

### Local Development
- [ ] PostgreSQL running
- [ ] Dependencies installed
- [ ] Database migrated
- [ ] Contract address configured
- [ ] Processor running
- [ ] GraphQL server accessible

### Production Deployment
- [ ] Environment variables set
- [ ] Database backups configured
- [ ] Monitoring set up
- [ ] SSL/TLS configured
- [ ] Rate limiting enabled
- [ ] Error tracking integrated
- [ ] Health checks configured

## 💡 Tips

- **Batch Processing**: SQD processes blocks in batches for efficiency
- **Incremental Sync**: Processor saves progress and resumes from last block
- **Real-time Data**: Add RPC endpoint for <1s latency
- **Reputation Updates**: Calculated on every payment, no manual refresh needed
- **Query Caching**: Use `serve:prod` for automatic query caching
- **Database Indexes**: Auto-generated from GraphQL schema

## 🔐 Security Notes

- GraphQL API is read-only
- Reputation data is cryptographically verified from blockchain
- No private keys stored in the indexer
- Rate limit the GraphQL endpoint in production
- Use read replicas for high-traffic deployments

## 📞 Support

- Check `TODO.md` for known issues
- See `ARCHITECTURE.md` for system design
- Review `SETUP.md` for detailed instructions
- Open GitHub issue for bugs

## 🎉 Quick Test

```bash
# Terminal 1: Start all services
docker-compose up -d

# Wait 30 seconds for sync to start

# Terminal 2: Query the API
curl -X POST http://localhost:4350/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ workers(limit: 5) { id reputationScore } }"}'
```

## 📊 Monitoring

Key metrics to watch:
- Blocks processed per second
- Query response times
- Database size
- API request rate
- Error rate

Use Prometheus + Grafana for production monitoring.
