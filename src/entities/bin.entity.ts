import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { WasteSubmission } from "./waste-submission.entity"

@Entity("bins")
export class Bin {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true, length: 50 })
  binCode: string

  @Column({ length: 255 })
  locationName: string

  @Column({ type: "decimal", precision: 10, scale: 8, nullable: true })
  latitude: number

  @Column({ type: "decimal", precision: 11, scale: 8, nullable: true })
  longitude: number

  @Column("text", { array: true })
  wasteTypes: string[]

  @Column({ length: 20, default: "active" })
  status: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(
    () => WasteSubmission,
    (submission) => submission.bin,
  )
  wasteSubmissions: WasteSubmission[]
}
