import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserEntity } from './user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordEmail(user: UserEntity) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Finder!',
      text: `Hello ${user.name}, you temporary password is: ${user.password}`,
    });
  }
}
