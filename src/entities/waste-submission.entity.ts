import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm"
import { User } from "./user.entity"
import { Bin } from "./bin.entity"
import { PointTransaction } from "./point-transaction.entity"

@Entity("waste_submissions")
export class WasteSubmission {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: number

  @Column()
  binId: number

  @Column({ length: 100 })
  wasteType: string

  @Column({ length: 50 })
  wasteCategory: string

  @Column({ default: 1 })
  quantity: number

  @Column({ default: 0 })
  pointsEarned: number

  @Column({ length: 500, nullable: true })
  verificationImageUrl: string

  @Column({ length: 100, nullable: true })
  transactionHash: string

  @Column({ length: 20, default: "pending" })
  status: string

  @CreateDateColumn()
  submittedAt: Date

  @Column({ nullable: true })
  verifiedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User

  @ManyToOne(() => Bin)
  @JoinColumn({ name: "binId" })
  bin: Bin

  @OneToMany(
    () => PointTransaction,
    (transaction) => transaction.wasteSubmission,
  )
  pointTransactions: PointTransaction[]
}
