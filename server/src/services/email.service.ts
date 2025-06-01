import nodemailer from 'nodemailer';

// Створюємо транспортер для Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'zoruana83@gmail.com',
    pass: 'cokoogumxndrkyix',
  },
});

class EmailService {
  public static async sendRestoreEmail(
    email: string = 'vladyslav.balushka@gmail.com',
    recoverCode: string
  ) {
    try {
      const mailOptions = {
        from: 'zoruana83@gmail.com',
        to: email,
        subject: 'Email sent',
        html: '<p>Recover code is: ' + recoverCode + '</p>',
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  public static async sendOneTimePassword(
    email: string = 'vladyslav.balushka@gmail.com',
    password: string
  ) {
    try {
      const mailOptions = {
        from: 'zoruana83@gmail.com',
        to: email,
        subject: 'Email sent',
        html: '<p>One time password is: ' + password + '</p>',
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}

export default EmailService;
