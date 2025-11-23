import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class BountyContract {
    constructor(props?: Partial<BountyContract>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @BigIntColumn_({nullable: false})
    totalPayments!: bigint

    @IntColumn_({nullable: false})
    totalWorkers!: number

    @BigIntColumn_({nullable: false})
    averagePayment!: bigint

    @DateTimeColumn_({nullable: false})
    deployedAt!: Date

    @StringColumn_({nullable: false})
    owner!: string
}
