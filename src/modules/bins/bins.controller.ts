import { Controller, Get, Param } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import type { BinsService } from "./bins.service"

@ApiTags("bins")
@Controller("bins")
export class BinsController {
  constructor(private readonly binsService: BinsService) {}

  @Get()
  @ApiOperation({ summary: "Get all active bins" })
  @ApiResponse({ status: 200, description: "List of active bins" })
  async getAllBins() {
    return this.binsService.findAllActive()
  }

  @Get("nearby")
  @ApiOperation({ summary: "Find nearby bins" })
  @ApiResponse({ status: 200, description: "List of nearby bins" })
  async getNearbyBins(
    lat: number,
    lng: number,
    radius = 5000, // 5km default
  ) {
    return this.binsService.findNearby(lat, lng, radius)
  }

  @Get(':binCode')
  @ApiOperation({ summary: 'Get bin details by code' })
  @ApiResponse({ status: 200, description: 'Bin details' })
  @ApiResponse({ status: 404, description: 'Bin not found' })
  async getBinByCode(@Param('binCode') binCode: string) {
    return this.binsService.findByCode(binCode);
  }

  @Get(':binCode/waste-types')
  @ApiOperation({ summary: 'Get accepted waste types for a bin' })
  @ApiResponse({ status: 200, description: 'List of accepted waste types' })
  async getAcceptedWasteTypes(@Param('binCode') binCode: string) {
    return this.binsService.getAcceptedWasteTypes(binCode);
  }
}
