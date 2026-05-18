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

  async sendDeletedEvent(user: UserEntity, eventName: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'An event that you were subscribed has been deleted!',
      text: `Hello ${user.name}, the ${eventName} event has beed deleted, look to the list of others events to subscribe to another one!`,
    });
  }
}
