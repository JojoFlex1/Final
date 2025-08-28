import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  Param,
  Patch,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../auth/jwt-auth.guard"
import type { WasteSubmissionsService } from "./waste-submissions.service"
import type { CreateWasteSubmissionDto } from "../../dto/create-waste-submission.dto"
import type { Express } from "express"

@ApiTags("waste-submissions")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("waste-submissions")
export class WasteSubmissionsController {
  constructor(private readonly wasteSubmissionsService: WasteSubmissionsService) {}

  @Post()
  @UseInterceptors(FileInterceptor("verificationImage"))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Submit waste disposal" })
  @ApiResponse({ status: 201, description: "Waste submission created successfully" })
  async createSubmission(
    req: any,
    @Body() createWasteSubmissionDto: CreateWasteSubmissionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.wasteSubmissionsService.create(req.user.userId, createWasteSubmissionDto, file)
  }

  @Post(":id/submit-transaction")
  @ApiOperation({ summary: "Submit signed transaction to blockchain" })
  @ApiResponse({ status: 200, description: "Transaction submitted successfully" })
  async submitTransaction(req: any, @Param('id') id: number, @Body('signedTxHex') signedTxHex: string) {
    const success = await this.wasteSubmissionsService.submitToBlockchain(id, signedTxHex)
    return { success, message: success ? "Transaction submitted successfully" : "Transaction submission failed" }
  }

  @Post(":id/verify-transaction")
  @ApiOperation({ summary: "Verify blockchain transaction" })
  @ApiResponse({ status: 200, description: "Transaction verification result" })
  async verifyTransaction(req: any, @Param('id') id: number) {
    const isVerified = await this.wasteSubmissionsService.verifyBlockchainTransaction(id)
    return { verified: isVerified, message: isVerified ? "Transaction verified" : "Transaction not found or invalid" }
  }

  @Get("my-submissions")
  @ApiOperation({ summary: "Get user's waste submissions" })
  @ApiResponse({ status: 200, description: "List of user submissions" })
  async getMySubmissions(
    req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
  ) {
    return this.wasteSubmissionsService.findUserSubmissions(req.user.userId, page, limit, status)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get submission details" })
  @ApiResponse({ status: 200, description: "Submission details" })
  async getSubmission(req: any, @Param('id') id: number) {
    return this.wasteSubmissionsService.findUserSubmission(req.user.userId, id)
  }

  @Patch(':id/verify')
  @ApiOperation({ summary: 'Verify waste submission (admin only)' })
  @ApiResponse({ status: 200, description: 'Submission verified' })
  async verifySubmission(@Param('id') id: number) {
    return this.wasteSubmissionsService.verifySubmission(id);
  }
}
