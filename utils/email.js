import nodemailer from 'nodemailer';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import pug from 'pug';
import { convert } from 'html-to-text';
import dotenv from 'dotenv';
import __dirname from './directory.js';

dotenv.config();

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.fromEmail = process.env.EMAIL_FROM;
    this.fromName = 'Menbere Tours';
  }

  // Nodemailer transport
  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    if (process.env.NODE_ENV === 'production') {
      // Production - MailerSend
      try {
        const mailerSend = new MailerSend({
          apiKey: process.env.MAILERSEND_API_KEY,
        });

        const sentFrom = new Sender(this.fromEmail, this.fromName);

        const recipients = [new Recipient(this.to, this.firstName)];

        const emailParams = new EmailParams()
          .setFrom(sentFrom)
          .setTo(recipients)
          .setSubject(subject)
          .setHtml(html)
          .setText(convert(html));

        await mailerSend.email.send(emailParams);
        console.log('✅ Email sent via MailerSend API');
      } catch (err) {
        console.error('MailerSend Error 💥', err.body || err);
      }
    } else {
      // Development → Nodemailer
      try {
        await this.newTransport().sendMail({
          from: `"${this.fromName}" <${this.fromEmail}>`,
          to: this.to,
          subject,
          html,
          text: convert(html),
        });
        console.log('✅ Email sent via Nodemailer (Dev)');
      } catch (err) {
        console.error('Nodemailer Error 💥', err);
      }
    }
  }

  // Welcome email
  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Menbere Family!');
  }

  // Password reset email
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
}

export default Email;
