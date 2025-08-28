import { Controller, Get, UseGuards, Req, Query } from "@nestjs/common"
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../auth/jwt-auth.guard"
import type { PointsService } from "./points.service"

@ApiTags("points")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("points")
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get('balance')
  @ApiOperation({ summary: 'Get user points balance' })
  @ApiResponse({ status: 200, description: 'User points balance' })
  async getBalance(@Req() req) {
    return this.pointsService.getUserPoints(req.user.userId);
  }

  @Get("transactions")
  @ApiOperation({ summary: "Get user point transactions history" })
  @ApiResponse({ status: 200, description: "List of point transactions" })
  async getTransactions(
    @Req() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('type') type?: string,
  ) {
    return this.pointsService.getUserTransactions(req.user.userId, page, limit, type)
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get points leaderboard' })
  @ApiResponse({ status: 200, description: 'Top users by points' })
  async getLeaderboard(@Query('limit') limit: number = 10) {
    return this.pointsService.getLeaderboard(limit);
  }
}
