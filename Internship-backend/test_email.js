require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = async () => {
    console.log('Testing Email Configuration...');
    console.log(`User: ${process.env.EMAIL_USER}`);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('ERROR: EMAIL_USER or EMAIL_PASS is missing in .env');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"Zeal IT Accounts Test" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // Send to self for testing
        subject: 'Zeal IT Accounts - Configuration Test',
        text: 'If you are receiving this email, your email configuration for the Zeal IT Accounts system is working correctly!',
        html: '<h3>Email Configuration Successful</h3><p>If you are receiving this email, your email configuration for the Zeal IT Accounts system is working correctly!</p>'
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
};

testEmail();
