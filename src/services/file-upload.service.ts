import { Injectable, BadRequestException } from "@nestjs/common"
import type { ConfigService } from "../config/config.service"
import * as path from "path"
import * as fs from "fs"
import { v4 as uuidv4 } from "uuid"
import type { Express } from "express"

@Injectable()
export class FileUploadService {
  private readonly uploadPath = "./uploads"

  constructor(private configService: ConfigService) {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true })
    }
  }

  async uploadImage(file: Express.Multer.File, folder = "general"): Promise<string> {
    if (!file) {
      throw new BadRequestException("No file provided")
    }

    // Validate file type
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException("Only JPEG, PNG, and WebP images are allowed")
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException("File size must be less than 5MB")
    }

    // Generate unique filename
    const fileExtension = path.extname(file.originalname)
    const fileName = `${uuidv4()}${fileExtension}`
    const folderPath = path.join(this.uploadPath, folder)

    // Ensure folder exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true })
    }

    const filePath = path.join(folderPath, fileName)

    // Save file
    fs.writeFileSync(filePath, file.buffer)

    // Return relative URL
    return `/uploads/${folder}/${fileName}`
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(".", filePath)
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath)
    }
  }
}
