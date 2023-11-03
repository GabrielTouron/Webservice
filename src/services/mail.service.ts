import { User } from '@prisma/client';
import mailClient from '../clients/brevo.client';
import { welcomeUser, resetPassword } from '../assets/templates/mail';

class MailService {
  async onRegister(user: User) {
    const { subject, content } = welcomeUser(user);
    mailClient.sendMail(user, subject, content);
  }

  async onPasswordReset(user: User, token: string) {
    const { subject, content } = resetPassword(user, token);
    mailClient.sendMail(user, subject, content);
  }
}

export default new MailService();
