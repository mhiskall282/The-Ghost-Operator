# Ghost Bot SQD Indexer - TODO

## Before Running

- [ ] **Update Contract Address**: Set `GHOST_BOUNTY_CONTRACT` in `src/constants.ts`
- [ ] **Update Deployment Block**: Set the block number in `src/processor.ts`
- [ ] **Generate Event Topics**: Run the contract through SQD typegen to get actual event topic hashes
- [ ] **Configure RPC Endpoint**: Add Polygon RPC endpoint in `.env` for real-time data (optional)

## Development Steps

1. **Generate TypeORM Models**
   ```bash
   npm run build
   ```

2. **Run Database Migrations**
   ```bash
   npm run db:migrate
   ```

3. **Start the Indexer**
   ```bash
   # Option 1: Docker (Recommended)
   docker-compose up -d
   
   # Option 2: Local development
   npm run process  # Terminal 1
   npm run serve    # Terminal 2
   ```

## Integration Tasks

### Smart Contract Integration

- [ ] Deploy the Ghost Bot bounty contract to Polygon
- [ ] Update contract address in configuration
- [ ] Generate ABI types using `@subsquid/evm-typegen`
- [ ] Update event handlers with proper decoding logic

### Event Decoding

The current implementation has placeholder logic. You need to:

1. **Generate ABI Types**:
   ```bash
   npx squid-evm-typegen src/abi src/abi/contract.json
   ```

2. **Update Event Handlers** in `src/main.ts`:
   - Decode `PaymentProcessed` events properly
   - Decode `BountyCreated` events
   - Decode `BountyClaimed` events

3. **Update Event Topics** in `src/processor.ts`:
   - Replace `'0x...'` with actual event topic hashes

### Testing

- [ ] Test with mock payment events
- [ ] Verify reputation calculation accuracy
- [ ] Test GraphQL queries
- [ ] Verify real-time data sync (if using RPC)

### Production Readiness

- [ ] Set up monitoring (Prometheus/Grafana)
- [ ] Configure database backups
- [ ] Set up alerts for indexer failures
- [ ] Optimize database indexes
- [ ] Add error handling and retry logic
- [ ] Deploy to SQD Cloud or self-hosted infrastructure

## Integration with Other Components

### XMTP Bot Integration

The XMTP bot can query worker reputation:

```typescript
const query = `
  query GetWorkerReputation($address: String!) {
    worker(id: $address) {
      reputationScore
      totalEarned
      totalTasksCompleted
      successRate
    }
  }
`

const response = await fetch('http://localhost:4350/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query,
    variables: { address: workerAddress }
  })
})
```

### Fluence Agent Integration

The Fluence agent can verify worker eligibility:

```rust
// Check if worker meets minimum reputation threshold
if worker.reputation_score >= 50.0 && worker.total_tasks_completed >= 5 {
    // Allow worker to claim high-value bounties
}
```

### Dashboard Integration

Build a frontend dashboard to display:
- Top earners leaderboard
- Payment trends over time
- Worker reputation scores
- Daily statistics

## Known Issues

- [ ] Event decoding uses placeholder logic - needs actual ABI
- [ ] Daily stats unique worker count not implemented
- [ ] Missing error handling for failed transactions
- [ ] No rate limiting on GraphQL API

## Next Steps

1. Complete smart contract deployment
2. Generate proper ABI types
3. Test with real payment events
4. Deploy indexer to production
5. Integrate with XMTP bot
6. Build analytics dashboard
