import { Controller, Get, Post, UseGuards, Request } from "@nestjs/common"
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger"
import { JwtAuthGuard } from "../../auth/jwt-auth.guard"
import type { CardanoService } from "../../services/cardano.service"

@ApiTags("cardano")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("cardano")
export class CardanoController {
  constructor(private readonly cardanoService: CardanoService) {}

  @Get("supported-waste-types")
  @ApiOperation({ summary: "Get waste types supported by smart contract" })
  @ApiResponse({ status: 200, description: "List of supported waste types" })
  getSupportedWasteTypes() {
    return {
      wasteTypes: this.cardanoService.getSupportedWasteTypes(),
    }
  }

  @Post("calculate-points")
  @ApiOperation({ summary: "Calculate points using smart contract logic" })
  @ApiResponse({ status: 200, description: "Calculated points" })
  calculatePoints(body: { wasteType: string; wasteCategory: string; quantity: number }) {
    const points = this.cardanoService.calculateContractPoints(body.wasteType, body.wasteCategory, body.quantity)
    return { points }
  }

  @Get('user-points')
  @ApiOperation({ summary: 'Get user points from smart contract' })
  @ApiResponse({ status: 200, description: 'User points from contract' })
  async getUserPoints(@Request() req: any) {
    // This would get the user's wallet address from the database
    const userAddress = 'addr_test1qz8p8rp4cvmnepjhh53j3ewqzsfmu4r3lcpyqpen4cpt4jcdetjl6fr0y9jdudksm22hx8x22q3p3q3zyxy84mlefqwslzevet';
    const points = await this.cardanoService.getUserPointsFromContract(userAddress);
    return { points };
  }
}
