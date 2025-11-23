# Ghost Bot SQD Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Ghost Bot System                         │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │    Worker    │
                    │   (Human)    │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │     XMTP     │ ◀──── Chat Interface
                    │   Messenger  │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
    ┌───▼────┐      ┌──────▼───────┐   ┌────▼─────┐
    │ vlayer │      │   Fluence    │   │ Polygon  │
    │ZK-TLS  │──────▶│    Agent     │───▶│ Contract │
    │Prover  │      │  (Verify)    │   │ (Payment)│
    └────────┘      └──────────────┘   └────┬─────┘
                                              │
                                        ┌─────▼─────┐
                                        │    SQD    │
                                        │  Indexer  │
                                        └─────┬─────┘
                                              │
                                        ┌─────▼─────┐
                                        │ GraphQL   │
                                        │    API    │
                                        └───────────┘
```

## SQD Indexer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     SQD Network Gateway                      │
│              (Polygon Historical Blockchain Data)            │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │  EvmBatchProcessor  │
                    │                     │
                    │  • Filters events   │
                    │  • Batches blocks   │
                    │  • Decodes logs     │
                    └─────────┬───────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
  ┌─────▼──────┐    ┌────────▼────────┐   ┌───────▼────────┐
  │  Payment   │    │     Bounty      │   │    Worker      │
  │ Processed  │    │    Created      │   │    Claimed     │
  │   Event    │    │     Event       │   │     Event      │
  └─────┬──────┘    └────────┬────────┘   └───────┬────────┘
        │                    │                     │
        └────────────────────┼─────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Event Handlers  │
                    │                  │
                    │  • Decode data   │
                    │  • Update stats  │
                    │  • Calculate rep │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
  ┌─────▼──────┐    ┌────────▼────────┐   ┌──────▼───────┐
  │  Worker    │    │    Payment       │   │  DailyStats  │
  │  Entity    │    │     Entity       │   │   Entity     │
  └─────┬──────┘    └────────┬─────────┘   └──────┬───────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   PostgreSQL    │
                    │    Database     │
                    └────────┬─────────┘
                             │
                    ┌────────▼────────┐
                    │  GraphQL Server  │
                    │                  │
                    │  • Query API     │
                    │  • Filtering     │
                    │  • Aggregations  │
                    └─────────────────┘
```

## Data Model

```
┌──────────────────────────────────────────────────────────────┐
│                      Database Schema                          │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐        ┌──────────────────────┐
│       Worker        │◀───┐   │      Payment         │
├─────────────────────┤    │   ├──────────────────────┤
│ id (address)        │    └───│ worker (FK)          │
│ totalEarned         │        │ amount               │
│ totalTasksCompleted │        │ token                │
│ successRate         │        │ status               │
│ reputationScore     │        │ taskType             │
│ avgPaymentTime      │        │ taskDescription      │
│ firstPaymentAt      │        │ proofId              │
│ lastPaymentAt       │        │ blockNumber          │
└─────────────────────┘        │ timestamp            │
                               │ transactionHash      │
                               │ gasUsed              │
                               └──────────────────────┘

┌─────────────────────┐        ┌──────────────────────┐
│   BountyContract    │        │    DailyStats        │
├─────────────────────┤        ├──────────────────────┤
│ id (address)        │        │ id (date)            │
│ totalPayments       │        │ date                 │
│ totalWorkers        │        │ totalPayments        │
│ averagePayment      │        │ paymentCount         │
│ deployedAt          │        │ uniqueWorkers        │
│ owner               │        │ averagePayment       │
└─────────────────────┘        └──────────────────────┘
```

## Reputation Calculation Algorithm

```
┌──────────────────────────────────────────────────────────────┐
│              Reputation Score Calculation                     │
│                      (0-100 scale)                            │
└──────────────────────────────────────────────────────────────┘

1. TASK COMPLETION SCORE (40%)
   ┌─────────────────────────────────────┐
   │ min(taskCount / 100, 1) × 40        │
   │                                     │
   │ Example:                            │
   │ • 25 tasks  → 0.25 × 40 = 10 pts   │
   │ • 100 tasks → 1.0 × 40 = 40 pts    │
   └─────────────────────────────────────┘

2. EARNINGS SCORE (30%)
   ┌─────────────────────────────────────┐
   │ min(totalEarned / 1B, 1) × 30      │
   │                                     │
   │ Example (USDC, 6 decimals):         │
   │ • 100 USDC  → 0.1 × 30 = 3 pts     │
   │ • 1000 USDC → 1.0 × 30 = 30 pts    │
   └─────────────────────────────────────┘

3. SUCCESS RATE SCORE (20%)
   ┌─────────────────────────────────────┐
   │ (successRate / 100) × 20           │
   │                                     │
   │ Example:                            │
   │ • 85% success → 0.85 × 20 = 17 pts │
   │ • 100% success → 1.0 × 20 = 20 pts │
   └─────────────────────────────────────┘

4. CONSISTENCY SCORE (10%)
   ┌─────────────────────────────────────┐
   │ avgTasksPerDay = tasks / totalDays │
   │ min(avgTasksPerDay / 2, 1) × 10    │
   │                                     │
   │ Example:                            │
   │ • 1 task/day  → 0.5 × 10 = 5 pts   │
   │ • 3 tasks/day → 1.0 × 10 = 10 pts  │
   └─────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ FINAL SCORE = Component1 + Component2 + Component3 + Component4│
└──────────────────────────────────────────────────────────────┘

Example Full Calculation:
Worker with:
- 50 completed tasks
- 500 USDC earned
- 95% success rate
- 2 tasks per day average

Score = (50/100 × 40) + (500/1000 × 30) + (0.95 × 20) + (2/2 × 10)
      = 20 + 15 + 19 + 10
      = 64 points
```

## Event Processing Flow

```
┌──────────────────────────────────────────────────────────────┐
│                   Block Processing Cycle                      │
└──────────────────────────────────────────────────────────────┘

1. FETCH BLOCKS
   ┌─────────────────────────────┐
   │ SQD Network Gateway          │
   │ ↓                            │
   │ Batch of blocks (e.g. 1000) │
   └──────────────┬───────────────┘
                  │
2. FILTER EVENTS  │
   ┌──────────────▼───────────────┐
   │ For each block:              │
   │   For each log:              │
   │     • Match address          │
   │     • Match topic0           │
   │     • Extract data           │
   └──────────────┬───────────────┘
                  │
3. DECODE DATA    │
   ┌──────────────▼───────────────┐
   │ PaymentProcessed:            │
   │   • worker: address          │
   │   • amount: uint256          │
   │   • token: address           │
   │   • proofId: string          │
   │   • taskType: enum           │
   │   • description: string      │
   └──────────────┬───────────────┘
                  │
4. UPDATE STATE   │
   ┌──────────────▼───────────────┐
   │ • Create/update Worker       │
   │ • Create Payment record      │
   │ • Update DailyStats          │
   │ • Increment counters         │
   └──────────────┬───────────────┘
                  │
5. CALCULATE      │
   ┌──────────────▼───────────────┐
   │ • Reputation score           │
   │ • Average payment time       │
   │ • Success rate               │
   └──────────────┬───────────────┘
                  │
6. PERSIST        │
   ┌──────────────▼───────────────┐
   │ • Batch insert to PostgreSQL │
   │ • Update indexes             │
   │ • Commit transaction         │
   └──────────────────────────────┘
```

## Integration Points

```
┌──────────────────────────────────────────────────────────────┐
│                     System Integration                        │
└──────────────────────────────────────────────────────────────┘

┌─────────────────┐
│   XMTP Bot      │  Queries:
├─────────────────┤  • GET worker reputation
│                 │  • GET payment history
│ /reputation     │  • GET leaderboard
│ /history        │  • CHECK eligibility
│ /leaderboard    │
└────────┬────────┘
         │
         │ HTTP POST (GraphQL)
         │
┌────────▼────────┐
│  SQD GraphQL    │  Provides:
├─────────────────┤  • Real-time reputation data
│                 │  • Payment analytics
│ Worker queries  │  • Historical trends
│ Payment queries │  • Aggregated stats
│ Stats queries   │
└────────┬────────┘
         │
         │ SQL Queries
         │
┌────────▼────────┐
│   PostgreSQL    │  Stores:
├─────────────────┤  • Worker profiles
│                 │  • Payment records
│ Workers table   │  • Daily statistics
│ Payments table  │  • Contract data
│ Stats table     │
└────────┬────────┘
         │
         │ Indexed from
         │
┌────────▼────────┐
│  Polygon Chain  │  Events:
├─────────────────┤  • PaymentProcessed
│                 │  • BountyCreated
│ Smart Contract  │  • BountyClaimed
│ Events          │
└─────────────────┘
```

## Deployment Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   Production Deployment                       │
└──────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │   Load Balancer │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
  ┌─────▼──────┐    ┌────────▼────────┐   ┌──────▼───────┐
  │ GraphQL    │    │    GraphQL      │   │   GraphQL    │
  │ Server 1   │    │    Server 2     │   │   Server 3   │
  └─────┬──────┘    └────────┬─────────┘   └──────┬───────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   PostgreSQL    │
                    │   (Primary)     │
                    └────────┬─────────┘
                             │
                    ┌────────▼────────┐
                    │   PostgreSQL    │
                    │   (Replica)     │
                    └─────────────────┘

        ┌──────────────────────────────┐
        │   Processor (Single)         │
        │                              │
        │   • Processes blocks         │
        │   • Updates database         │
        │   • Calculates reputation    │
        └────────┬─────────────────────┘
                 │
        ┌────────▼─────────┐
        │   SQD Network    │
        │   (Gateway)      │
        └──────────────────┘
```

## Performance Characteristics

```
┌──────────────────────────────────────────────────────────────┐
│                  Performance Metrics                          │
└──────────────────────────────────────────────────────────────┘

Indexing Speed:
├─ Historical sync: ~1000-5000 blocks/second
├─ Real-time: <1 second latency
└─ Full sync (from genesis): ~2-4 hours (Polygon)

Query Performance:
├─ Worker lookup: <10ms
├─ Payment history: <50ms (100 records)
├─ Reputation calculation: On-write (0ms query overhead)
└─ Leaderboard: <100ms (top 100)

Storage:
├─ ~1KB per payment record
├─ ~2KB per worker profile
└─ Expected: ~10GB for 1M payments

Scalability:
├─ GraphQL: Horizontal scaling (multiple servers)
├─ Processor: Vertical scaling (single instance)
└─ Database: Read replicas for query load
```

## Security Considerations

```
┌──────────────────────────────────────────────────────────────┐
│                    Security Model                             │
└──────────────────────────────────────────────────────────────┘

Data Integrity:
✓ Sourced from immutable blockchain
✓ Cryptographically verified events
✓ Deterministic reputation calculation

Access Control:
✓ Read-only public GraphQL API
✓ No write access from external sources
✓ Database access restricted to processor

Attack Vectors:
✓ Sybil resistance: On-chain payments required
✓ Reputation gaming: Multi-factor scoring
✓ DoS protection: Rate limiting on GraphQL
```
