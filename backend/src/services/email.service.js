const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail({ to, subject, text, html }) {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL,
        to,
        subject,
        text,
        html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendSignatureNotification(document, signer) {
    const subject = 'New Signature Added to Your Document';
    const html = `
      <h2>New Signature Added</h2>
      <p>Hello ${document.createdBy.name},</p>
      <p>${signer.name} has signed your document "${document.originalName}".</p>
      <p>Current Status:</p>
      <ul>
        ${document.signatureFields.map(field => `
          <li>${field.signedBy ? 
            `Signed by ${field.signedBy.name} on ${new Date(field.signedBy.timestamp).toLocaleString()}` :
            'Pending signature'
          }</li>
        `).join('')}
      </ul>
      <p>You can view the document using this link: ${process.env.FRONTEND_URL}/documents/${document.accessToken}</p>
    `;

    return this.sendEmail({
      to: document.createdBy.email,
      subject,
      html
    });
  }

  async sendCompletionNotification(document) {
    const subject = 'Document Signing Completed';
    const html = `
      <h2>Document Signing Completed</h2>
      <p>Hello ${document.createdBy.name},</p>
      <p>All signatures have been collected for your document "${document.originalName}".</p>
      <p>You can download the final signed document here: ${process.env.FRONTEND_URL}/documents/${document.accessToken}/download</p>
    `;

    return this.sendEmail({
      to: document.createdBy.email,
      subject,
      html
    });
  }
}

module.exports = new EmailService();
