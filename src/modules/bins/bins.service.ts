import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Bin } from "../../entities/bin.entity"

@Injectable()
export class BinsService {
  constructor(private binRepository: Repository<Bin>) {}

  async findAllActive(): Promise<Bin[]> {
    return this.binRepository.find({
      where: { status: "active" },
      order: { locationName: "ASC" },
    })
  }

  async findByCode(binCode: string): Promise<Bin> {
    const bin = await this.binRepository.findOne({
      where: { binCode, status: "active" },
    })

    if (!bin) {
      throw new NotFoundException("Bin not found or inactive")
    }

    return bin
  }

  async findNearby(latitude: number, longitude: number, radiusInMeters: number): Promise<Bin[]> {
    // Using Haversine formula for distance calculation
    const query = `
      SELECT *, (
        6371000 * acos(
          cos(radians($1)) * cos(radians(latitude)) *
          cos(radians(longitude) - radians($2)) +
          sin(radians($1)) * sin(radians(latitude))
        )
      ) AS distance
      FROM bins
      WHERE status = 'active'
      HAVING distance <= $3
      ORDER BY distance ASC
    `

    return this.binRepository.query(query, [latitude, longitude, radiusInMeters])
  }

  async getAcceptedWasteTypes(binCode: string): Promise<{ wasteTypes: string[] }> {
    const bin = await this.findByCode(binCode)
    return { wasteTypes: bin.wasteTypes }
  }
}
