import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { WasteSubmissionsController } from "./waste-submissions.controller"
import { WasteSubmissionsService } from "./waste-submissions.service"
import { WasteSubmission } from "../../entities/waste-submission.entity"
import { BinsModule } from "../bins/bins.module"
import { PointsModule } from "../points/points.module"
import { FileUploadService } from "../../services/file-upload.service"
import { CardanoService } from "../../services/cardano.service"

@Module({
  imports: [TypeOrmModule.forFeature([WasteSubmission]), BinsModule, PointsModule],
  controllers: [WasteSubmissionsController],
  providers: [WasteSubmissionsService, FileUploadService, CardanoService],
  exports: [WasteSubmissionsService],
})
export class WasteSubmissionsModule {}
