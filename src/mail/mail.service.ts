import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordReset(to: string, resetUrl: string): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: 'Réinitialisation de votre mot de passe',
      template: 'reset-password',
      context: {
        resetUrl,
        year: new Date().getFullYear(),
      },
    });
  }
}
