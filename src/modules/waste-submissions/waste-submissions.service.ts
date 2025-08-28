import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { WasteSubmission } from "../../entities/waste-submission.entity"
import type { CreateWasteSubmissionDto } from "../../dto/create-waste-submission.dto"
import type { BinsService } from "../bins/bins.service"
import type { PointsService } from "../points/points.service"
import type { FileUploadService } from "../../services/file-upload.service"
import type { CardanoService } from "../../services/cardano.service"
import type { Express } from "express"

@Injectable()
export class WasteSubmissionsService {
  constructor(
    private wasteSubmissionRepository: Repository<WasteSubmission>,
    private binsService: BinsService,
    private pointsService: PointsService,
    private fileUploadService: FileUploadService,
    private cardanoService: CardanoService,
  ) {}

  async create(
    userId: number,
    createWasteSubmissionDto: CreateWasteSubmissionDto,
    file?: Express.Multer.File,
  ): Promise<WasteSubmission> {
    // Verify bin exists and accepts this waste type
    const bin = await this.binsService.findByCode(createWasteSubmissionDto.binCode)

    if (!bin.wasteTypes.includes(createWasteSubmissionDto.wasteType)) {
      throw new BadRequestException(
        `This bin does not accept ${createWasteSubmissionDto.wasteType}. Accepted types: ${bin.wasteTypes.join(", ")}`,
      )
    }

    // Verify waste type is supported by smart contract
    const supportedTypes = this.cardanoService.getSupportedWasteTypes()
    if (!supportedTypes.includes(createWasteSubmissionDto.wasteType)) {
      throw new BadRequestException(
        `Waste type ${createWasteSubmissionDto.wasteType} is not supported by the smart contract`,
      )
    }

    const pointsEarned = this.cardanoService.calculateContractPoints(
      createWasteSubmissionDto.wasteType,
      createWasteSubmissionDto.wasteCategory,
      createWasteSubmissionDto.quantity || 1,
    )

    // Upload verification image if provided
    let verificationImageUrl: string | null = null
    if (file) {
      verificationImageUrl = await this.fileUploadService.uploadImage(file, "waste-verification")
    }

    // Create waste submission
    const submission = this.wasteSubmissionRepository.create({
      userId,
      binId: bin.id,
      wasteType: createWasteSubmissionDto.wasteType,
      wasteCategory: createWasteSubmissionDto.wasteCategory,
      quantity: createWasteSubmissionDto.quantity || 1,
      pointsEarned,
      verificationImageUrl,
      status: "pending",
    })

    const savedSubmission = await this.wasteSubmissionRepository.save(submission)

    try {
      const userWallet = await this.getUserWallet(userId)
      const txHex = await this.cardanoService.buildWasteSubmissionTx({
        wasteType: createWasteSubmissionDto.wasteType,
        wasteCategory: createWasteSubmissionDto.wasteCategory,
        quantity: createWasteSubmissionDto.quantity || 1,
        binId: bin.id,
        userAddress: userWallet.walletAddress,
      })

      // Store transaction hex for later signing
      savedSubmission.transactionHash = `pending:${txHex}`
      await this.wasteSubmissionRepository.save(savedSubmission)

      // Award points locally (will be verified against contract later)
      await this.pointsService.awardPoints(userId, pointsEarned, savedSubmission.id, "Waste disposal reward")
    } catch (error) {
      console.error("Error building smart contract transaction:", error)
      // Continue without contract integration for now
    }

    return savedSubmission
  }

  async submitToBlockchain(submissionId: number, signedTxHex: string): Promise<boolean> {
    const submission = await this.wasteSubmissionRepository.findOne({
      where: { id: submissionId },
    })

    if (!submission) {
      throw new NotFoundException("Submission not found")
    }

    try {
      const result = await this.cardanoService.submitTransaction(signedTxHex)

      if (result.success) {
        submission.transactionHash = result.txHash
        submission.status = "verified"
        submission.verifiedAt = new Date()
        await this.wasteSubmissionRepository.save(submission)
        return true
      } else {
        console.error("Transaction submission failed:", result.error)
        return false
      }
    } catch (error) {
      console.error("Error submitting to blockchain:", error)
      return false
    }
  }

  async verifyBlockchainTransaction(submissionId: number): Promise<boolean> {
    const submission = await this.wasteSubmissionRepository.findOne({
      where: { id: submissionId },
    })

    if (!submission || !submission.transactionHash) {
      return false
    }

    // Skip verification for pending transactions
    if (submission.transactionHash.startsWith("pending:")) {
      return false
    }

    try {
      const isVerified = await this.cardanoService.verifyTransaction(submission.transactionHash)

      if (isVerified && submission.status !== "verified") {
        submission.status = "verified"
        submission.verifiedAt = new Date()
        await this.wasteSubmissionRepository.save(submission)
      }

      return isVerified
    } catch (error) {
      console.error("Error verifying blockchain transaction:", error)
      return false
    }
  }

  async findUserSubmissions(userId: number, page = 1, limit = 10, status?: string) {
    const query = this.wasteSubmissionRepository
      .createQueryBuilder("submission")
      .leftJoinAndSelect("submission.bin", "bin")
      .where("submission.userId = :userId", { userId })

    if (status) {
      query.andWhere("submission.status = :status", { status })
    }

    const [submissions, total] = await query
      .orderBy("submission.submittedAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    return {
      submissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findUserSubmission(userId: number, submissionId: number): Promise<WasteSubmission> {
    const submission = await this.wasteSubmissionRepository.findOne({
      where: { id: submissionId, userId },
      relations: ["bin"],
    })

    if (!submission) {
      throw new NotFoundException("Submission not found")
    }

    return submission
  }

  async verifySubmission(submissionId: number): Promise<WasteSubmission> {
    const submission = await this.wasteSubmissionRepository.findOne({
      where: { id: submissionId },
    })

    if (!submission) {
      throw new NotFoundException("Submission not found")
    }

    submission.status = "verified"
    submission.verifiedAt = new Date()

    return this.wasteSubmissionRepository.save(submission)
  }

  private async getUserWallet(userId: number): Promise<{ walletAddress: string }> {
    // This would typically query the user table for wallet info
    // For now, return mock data
    return {
      walletAddress:
        "addr_test1qz8p8rp4cvmnepjhh53j3ewqzsfmu4r3lcpyqpen4cpt4jcdetjl6fr0y9jdudksm22hx8x22q3p3q3zyxy84mlefqwslzevet",
    }
  }
}
