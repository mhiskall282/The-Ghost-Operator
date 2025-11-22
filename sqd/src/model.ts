import { Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_ } from "typeorm";
import { Payout } from "./model.generated";

@Entity_()
export class Bounty {
  constructor(props?: Partial<Bounty>) {
    Object.assign(this, props);
  }

  @PrimaryColumn_()
  id!: string;

  @Column_("text", { nullable: false })
  creator!: string;

  @Column_("int4", { nullable: false })
  action!: number;

  @Column_("text", { nullable: false })
  repoOwner!: string;

  @Column_("text", { nullable: false })
  repoName!: string;

  @Column_("numeric", { nullable: false })
  prOrIssueNumber!: bigint;

  @Column_("numeric", { nullable: false })
  reward!: bigint;

  @Column_("int4", { nullable: false })
  status!: number;

  @Column_("text", { nullable: true })
  completedBy?: string;

  @Column_("numeric", { nullable: false })
  createdAt!: bigint;

  @Column_("numeric", { nullable: true })
  completedAt?: bigint;

  @Column_("timestamp with time zone", { nullable: false })
  createdAtTimestamp!: Date;

  @Column_("timestamp with time zone", { nullable: true })
  completedAtTimestamp?: Date;
}

@Entity_()
export class Payout {
  constructor(props?: Partial<Payout>) {
    Object.assign(this, props);
  }

  @PrimaryColumn_()
  id!: string;

  @Index_()
  @Column_("numeric", { nullable: false })
  bountyId!: bigint;

  @Index_()
  @Column_("text", { nullable: false })
  worker!: string;

  @Column_("numeric", { nullable: false })
  amount!: bigint;

  @Column_("numeric", { nullable: false })
  timestamp!: bigint;

  @Column_("timestamp with time zone", { nullable: false })
  timestampDate!: Date;

  @Column_("text", { nullable: true })
  proofId?: string;
}

@Entity_()
export class Worker {
  constructor(props?: Partial<Worker>) {
    Object.assign(this, props);
  }

  @PrimaryColumn_()
  id!: string;

  @Column_("int4", { nullable: false })
  completedBounties!: number;

  @Column_("numeric", { nullable: false })
  totalEarnings!: bigint;

  @Column_("float8", { nullable: false })
  reputationScore!: number;

  @Column_("numeric", { nullable: true })
  firstBountyAt?: bigint;

  @Column_("numeric", { nullable: true })
  lastBountyAt?: bigint;
}

@Entity_()
export class Proof {
  constructor(props?: Partial<Proof>) {
    Object.assign(this, props);
  }

  @PrimaryColumn_()
  id!: string;

  @Index_()
  @Column_("numeric", { nullable: false })
  bountyId!: bigint;

  @Index_()
  @Column_("text", { nullable: false })
  worker!: string;

  @Column_("bool", { nullable: false })
  verified!: boolean;

  @Column_("numeric", { nullable: false })
  timestamp!: bigint;

  @Column_("timestamp with time zone", { nullable: false })
  timestampDate!: Date;
}

