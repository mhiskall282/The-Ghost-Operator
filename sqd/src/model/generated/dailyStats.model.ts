import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, DateTimeColumn as DateTimeColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class DailyStats {
    constructor(props?: Partial<DailyStats>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @DateTimeColumn_({nullable: false})
    date!: Date

    @BigIntColumn_({nullable: false})
    totalPayments!: bigint

    @IntColumn_({nullable: false})
    paymentCount!: number

    @IntColumn_({nullable: false})
    uniqueWorkers!: number

    @BigIntColumn_({nullable: false})
    averagePayment!: bigint
}
