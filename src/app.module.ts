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
import { BullModule } from '@nestjs/bullmq';
import { JobsModule } from './jobs/jobs.module';
import { GatewayModule } from './gateway/gateway.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    AddressModule,
    PlaceModule,
    AuthModule,
    ExternalPlacesModule,
    JobsModule,
    GatewayModule,
    EventModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SANDBOX_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.SANDBOX_USERNAME,
          pass: process.env.SANDBOX_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <noreply@finder.com>',
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
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
        host: process.env.REDIS_HOST ?? 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
