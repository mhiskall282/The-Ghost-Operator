# Sample GraphQL Queries for Ghost Bot SQD Indexer

## Worker Queries

### Get Top Workers by Reputation
```graphql
query TopWorkers {
  workers(orderBy: reputationScore_DESC, limit: 10) {
    id
    reputationScore
    totalEarned
    totalTasksCompleted
    successRate
    firstPaymentAt
    lastPaymentAt
  }
}
```

### Get Worker Profile
```graphql
query WorkerProfile($address: String!) {
  worker(id: $address) {
    id
    reputationScore
    totalEarned
    totalTasksCompleted
    successRate
    averagePaymentTime
    firstPaymentAt
    lastPaymentAt
    payments(limit: 10, orderBy: timestamp_DESC) {
      id
      amount
      token
      taskType
      taskDescription
      timestamp
      transactionHash
    }
  }
}
```

### Search Workers by Minimum Reputation
```graphql
query HighReputationWorkers($minScore: Float!) {
  workers(
    where: { reputationScore_gte: $minScore }
    orderBy: reputationScore_DESC
    limit: 50
  ) {
    id
    reputationScore
    totalEarned
    totalTasksCompleted
  }
}
```

## Payment Queries

### Recent Payments
```graphql
query RecentPayments {
  payments(orderBy: timestamp_DESC, limit: 20) {
    id
    amount
    token
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

### Worker Payment History
```graphql
query WorkerPayments($workerAddress: String!, $limit: Int!) {
  payments(
    where: { worker: { id_eq: $workerAddress } }
    orderBy: timestamp_DESC
    limit: $limit
  ) {
    id
    amount
    token
    status
    taskType
    taskDescription
    proofId
    timestamp
    transactionHash
  }
}
```

### Payments by Task Type
```graphql
query PaymentsByTaskType($taskType: TaskType!) {
  payments(
    where: { taskType_eq: $taskType }
    orderBy: timestamp_DESC
    limit: 50
  ) {
    id
    amount
    worker {
      id
      reputationScore
    }
    timestamp
    taskDescription
  }
}
```

### High Value Payments
```graphql
query HighValuePayments($minAmount: BigInt!) {
  payments(
    where: { amount_gte: $minAmount }
    orderBy: amount_DESC
    limit: 20
  ) {
    id
    amount
    token
    taskType
    worker {
      id
      reputationScore
      totalEarned
    }
    timestamp
    transactionHash
  }
}
```

## Statistics Queries

### Daily Statistics
```graphql
query DailyStats($days: Int!) {
  dailyStats(orderBy: date_DESC, limit: $days) {
    id
    date
    totalPayments
    paymentCount
    uniqueWorkers
    averagePayment
  }
}
```

### Monthly Summary
```graphql
query MonthlySummary {
  dailyStats(
    orderBy: date_DESC
    limit: 30
  ) {
    date
    totalPayments
    paymentCount
    averagePayment
  }
}
```

## Analytics Queries

### Total Platform Statistics
```graphql
query PlatformStats {
  workers(limit: 1) {
    __typename
  }
  payments(limit: 1) {
    __typename
  }
  workersConnection {
    totalCount
  }
  paymentsConnection {
    totalCount
  }
}
```

### Top Earners This Week
```graphql
query TopEarnersThisWeek($since: DateTime!) {
  payments(
    where: { timestamp_gte: $since }
    orderBy: amount_DESC
    limit: 10
  ) {
    worker {
      id
      reputationScore
      totalEarned
    }
    amount
    timestamp
  }
}
```

### Task Type Distribution
```graphql
query TaskTypeDistribution {
  payments(limit: 1000) {
    taskType
    amount
  }
}
```

## Example Query with Variables

### Check Worker Eligibility for Premium Task
```graphql
query CheckWorkerEligibility(
  $address: String!
  $minReputation: Float!
  $minTasks: Int!
) {
  worker(id: $address) {
    id
    reputationScore
    totalTasksCompleted
    successRate
    isEligible: reputationScore @include(if: true)
  }
}
```

Variables:
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "minReputation": 70.0,
  "minTasks": 10
}
```

## Aggregation Queries

### Worker Performance Summary
```graphql
query WorkerPerformanceSummary {
  workers(orderBy: reputationScore_DESC, limit: 100) {
    id
    reputationScore
    totalEarned
    totalTasksCompleted
    successRate
    averagePaymentTime
  }
}
```

### Payment Trends
```graphql
query PaymentTrends($startDate: DateTime!, $endDate: DateTime!) {
  payments(
    where: {
      timestamp_gte: $startDate
      timestamp_lte: $endDate
    }
    orderBy: timestamp_ASC
  ) {
    amount
    timestamp
    taskType
  }
}
```

## Real-time Monitoring Queries

### Latest Activity
```graphql
query LatestActivity {
  payments(orderBy: timestamp_DESC, limit: 5) {
    id
    worker {
      id
    }
    amount
    taskType
    timestamp
  }
}
```

### Active Workers Today
```graphql
query ActiveWorkersToday($today: DateTime!) {
  payments(
    where: { timestamp_gte: $today }
    orderBy: timestamp_DESC
  ) {
    worker {
      id
      reputationScore
    }
    timestamp
  }
}
```

## Reputation System Queries

### Workers Needing Review
```graphql
query WorkersNeedingReview($threshold: Float!) {
  workers(
    where: {
      reputationScore_lt: $threshold
      totalTasksCompleted_gte: 5
    }
    orderBy: reputationScore_ASC
  ) {
    id
    reputationScore
    totalTasksCompleted
    successRate
    payments(limit: 5, orderBy: timestamp_DESC) {
      status
      timestamp
    }
  }
}
```

### Star Performers
```graphql
query StarPerformers {
  workers(
    where: {
      reputationScore_gte: 90
      totalTasksCompleted_gte: 20
    }
    orderBy: totalEarned_DESC
  ) {
    id
    reputationScore
    totalEarned
    totalTasksCompleted
    successRate
  }
}
```
