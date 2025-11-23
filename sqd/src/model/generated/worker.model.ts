import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, FloatColumn as FloatColumn_, DateTimeColumn as DateTimeColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Payment} from "./payment.model"

@Entity_()
export class Worker {
    constructor(props?: Partial<Worker>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @BigIntColumn_({nullable: false})
    totalEarned!: bigint

    @IntColumn_({nullable: false})
    totalTasksCompleted!: number

    @FloatColumn_({nullable: false})
    successRate!: number

    @IntColumn_({nullable: false})
    averagePaymentTime!: number

    @DateTimeColumn_({nullable: true})
    firstPaymentAt!: Date | undefined | null

    @DateTimeColumn_({nullable: true})
    lastPaymentAt!: Date | undefined | null

    @OneToMany_(() => Payment, e => e.worker)
    payments!: Payment[]

    @FloatColumn_({nullable: false})
    reputationScore!: number
}
