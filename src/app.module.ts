import { Module } from '@nestjs/common';
import { AddressModule } from './address/address.module';
import { PlaceModule } from './place/place.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './config/postgres.config.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { ExternalPlacesModule } from './external-places/external-places.module';
import { BullModule } from "@nestjs/bullmq"
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    AddressModule,
    PlaceModule,
    AuthModule,
    ExternalPlacesModule,
    JobsModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService]
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST ?? 'localhost',
            port: 6379,
          },
          ttl: 60,
        }),
      }),
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST ?? "localhost",
        port: 6379,
      }
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}