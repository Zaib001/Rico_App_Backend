const nodemailer = require('nodemailer');

// Function to send a test email
exports.sendTestEmail = async (to, subject, text) => {
  try {
    // Generate a test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();

    // Create a transporter object using Ethereal's test SMTP service
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    // Email options
    const mailOptions = {
      from: '"Test Mail" <no-reply@example.com>',
      to, // Receiver's email
      subject, // Subject of the email
      text, // Body of the email
    };

    // Send mail with defined transport object
    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); // Preview in Ethereal

    return info;
  } catch (error) {
    console.error('Error sending test email:', error);
    throw new Error('Failed to send test email');
  }
};
