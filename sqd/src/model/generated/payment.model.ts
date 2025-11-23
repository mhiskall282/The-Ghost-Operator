import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {Worker} from "./worker.model"
import {PaymentStatus} from "./_paymentStatus"
import {TaskType} from "./_taskType"

@Entity_()
export class Payment {
    constructor(props?: Partial<Payment>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Worker, {nullable: true})
    worker!: Worker

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @StringColumn_({nullable: false})
    token!: string

    @Column_("varchar", {length: 9, nullable: false})
    status!: PaymentStatus

    @Column_("varchar", {length: 10, nullable: false})
    taskType!: TaskType

    @StringColumn_({nullable: true})
    taskDescription!: string | undefined | null

    @StringColumn_({nullable: false})
    proofId!: string

    @IntColumn_({nullable: false})
    blockNumber!: number

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @StringColumn_({nullable: false})
    transactionHash!: string

    @BigIntColumn_({nullable: true})
    gasUsed!: bigint | undefined | null
}
