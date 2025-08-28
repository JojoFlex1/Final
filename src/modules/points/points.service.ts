import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { UserPoints } from "../../entities/user-points.entity"
import type { PointTransaction } from "../../entities/point-transaction.entity"

@Injectable()
export class PointsService {
  constructor(
    private userPointsRepository: Repository<UserPoints>,
    private pointTransactionRepository: Repository<PointTransaction>,
  ) {}

  async getUserPoints(userId: number): Promise<UserPoints> {
    let userPoints = await this.userPointsRepository.findOne({
      where: { userId },
    })

    if (!userPoints) {
      // Create initial points record for user
      userPoints = this.userPointsRepository.create({
        userId,
        totalPoints: 0,
        availablePoints: 0,
        lifetimePoints: 0,
      })
      userPoints = await this.userPointsRepository.save(userPoints)
    }

    return userPoints
  }

  async awardPoints(userId: number, points: number, wasteSubmissionId?: number, description?: string): Promise<void> {
    // Get or create user points record
    const userPoints = await this.getUserPoints(userId)

    // Update points
    userPoints.totalPoints += points
    userPoints.availablePoints += points
    userPoints.lifetimePoints += points

    await this.userPointsRepository.save(userPoints)

    // Create transaction record
    const transaction = this.pointTransactionRepository.create({
      userId,
      wasteSubmissionId,
      transactionType: "earned",
      pointsAmount: points,
      description: description || "Points earned",
    })

    await this.pointTransactionRepository.save(transaction)
  }

  async deductPoints(userId: number, points: number, description?: string): Promise<boolean> {
    const userPoints = await this.getUserPoints(userId)

    if (userPoints.availablePoints < points) {
      return false // Insufficient points
    }

    // Update points
    userPoints.totalPoints -= points
    userPoints.availablePoints -= points

    await this.userPointsRepository.save(userPoints)

    // Create transaction record
    const transaction = this.pointTransactionRepository.create({
      userId,
      transactionType: "redeemed",
      pointsAmount: -points,
      description: description || "Points redeemed",
    })

    await this.pointTransactionRepository.save(transaction)

    return true
  }

  async getUserTransactions(userId: number, page = 1, limit = 10, type?: string) {
    const query = this.pointTransactionRepository
      .createQueryBuilder("transaction")
      .leftJoinAndSelect("transaction.wasteSubmission", "submission")
      .leftJoinAndSelect("submission.bin", "bin")
      .where("transaction.userId = :userId", { userId })

    if (type) {
      query.andWhere("transaction.transactionType = :type", { type })
    }

    const [transactions, total] = await query
      .orderBy("transaction.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async getLeaderboard(limit = 10) {
    const leaderboard = await this.userPointsRepository
      .createQueryBuilder("points")
      .leftJoinAndSelect("points.user", "user")
      .orderBy("points.lifetimePoints", "DESC")
      .limit(limit)
      .getMany()

    return leaderboard.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      username: entry.user?.username,
      firstName: entry.user?.firstName,
      lastName: entry.user?.lastName,
      lifetimePoints: entry.lifetimePoints,
      totalPoints: entry.totalPoints,
    }))
  }
}
