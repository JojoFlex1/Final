import { IsString, IsOptional, IsEmail, IsDateString, IsPhoneNumber } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class UpdateUserProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  country?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  postalCode?: string
}
