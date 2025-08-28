import { type MiddlewareConsumer, Module, type NestModule } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { APP_GUARD } from "@nestjs/core"
import { AuthModule } from "./auth/auth.module"
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler"
import { DbModule } from "./db/db.module"
import { SeederModule } from "./seeder/seeder.module"
import { ConfigModule } from "./config/config.module"
import { ConfigService } from "./config/config.service"
import { RoleModule } from "./role/role.module"
import { LoggerMiddleware } from "src/common/middleware/logger.middleware"
import { ScheduleModule } from "@nestjs/schedule"
import { UserModule } from "./user/user.module"
import { I18nModule, AcceptLanguageResolver, QueryResolver, HeaderResolver } from "nestjs-i18n"
import * as path from "path"
import { BinsModule } from "./modules/bins/bins.module"
import { WasteSubmissionsModule } from "./modules/waste-submissions/waste-submissions.module"
import { PointsModule } from "./modules/points/points.module"
import { CardanoModule } from "./modules/cardano/cardano.module" // Added Cardano module

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: ConfigService.App.ttl,
        limit: ConfigService.App.limit,
      },
    ]),
    ConfigModule,
    DbModule,
    SeederModule,
    AuthModule,
    RoleModule,
    ScheduleModule.forRoot(),
    I18nModule.forRoot({
      fallbackLanguage: "en",
      loaderOptions: {
        path: path.join(__dirname, "/message/"),
        watch: true,
      },
      resolvers: [{ use: QueryResolver, options: ["lang"] }, AcceptLanguageResolver, new HeaderResolver(["x-lang"])],
    }),
    UserModule,
    BinsModule,
    WasteSubmissionsModule,
    PointsModule,
    CardanoModule, // Added Cardano module
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*")
  }
}
