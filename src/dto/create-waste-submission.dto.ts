import { IsString, IsNumber, IsOptional, IsIn, Min } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateWasteSubmissionDto {
  @ApiProperty({ description: "Bin code scanned by user" })
  @IsString()
  binCode: string

  @ApiProperty({ description: "Type of waste being disposed" })
  @IsString()
  wasteType: string

  @ApiProperty({ description: "Category of waste", enum: ["standard", "battery", "hazardous"] })
  @IsIn(["standard", "battery", "hazardous"])
  wasteCategory: string

  @ApiProperty({ description: "Quantity of items", minimum: 1, default: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number = 1

  @ApiProperty({ description: "Verification image file", type: "string", format: "binary", required: false })
  @IsOptional()
  verificationImage?: any
}
