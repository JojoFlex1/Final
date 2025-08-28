import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { User } from "./user.entity"

@Entity("user_points")
export class UserPoints {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  userId: number

  @Column({ default: 0 })
  totalPoints: number

  @Column({ default: 0 })
  availablePoints: number

  @Column({ default: 0 })
  lifetimePoints: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User
}
