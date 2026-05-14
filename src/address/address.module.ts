import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { AddressEntity } from './address.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ViaCepService } from './viaCep.service';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity]), AuthModule],
  controllers: [AddressController],
  providers: [AddressService, ViaCepService],
  exports: [ViaCepService],
})
export class AddressModule {}
