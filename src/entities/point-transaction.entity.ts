import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./user.entity"
import { WasteSubmission } from "./waste-submission.entity"

@Entity("point_transactions")
export class PointTransaction {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: number

  @Column({ nullable: true })
  wasteSubmissionId: number

  @Column({ length: 20 })
  transactionType: string // earned, redeemed, bonus, penalty

  @Column()
  pointsAmount: number

  @Column("text", { nullable: true })
  description: string

  @Column({ length: 100, nullable: true })
  cardanoTxHash: string

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User

  @ManyToOne(() => WasteSubmission, { nullable: true })
  @JoinColumn({ name: "wasteSubmissionId" })
  wasteSubmission: WasteSubmission
}
