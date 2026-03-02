import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

/**
 * Configure the SMTP transporter
 * We use Gmail service here. If using a different provider (Outlook, Zoho, etc.),
 * you would change 'service' or provide 'host' and 'port'.
 */
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS  // Your 16-character App Password
    }
});

/**
 * Function to send Authentication/Password Reset Emails
 * @param {string} email - Recipient's email address
 * @param {string} token - The 20-minute JWT token
 * @param {string} type - 'setup' for first login, 'reset' for password change
 */
export const sendAuthEmail = async (email, token, type = 'setup') => {
    const isFirstTime = type === 'setup';
    
    // Choose subject based on the context
    const subject = isFirstTime 
        ? "Welcome! Create your password - Gestion de Absences" 
        : "Reset your password - Gestion de Absences";
    
    // This is the link the user will click in the email.
    // It leads to your FRONTEND page, passing the token in the URL.
    const actionLink = `${process.env.BASE_URL}/Frontend/pages/create-password/create-password.html?token=${token}`;

    const mailOptions = {
        from: `"Gestion de Absences" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subject,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #333;">${isFirstTime ? 'Welcome to the Platform!' : 'Password Reset Request'}</h2>
                <p style="font-size: 16px; color: #555;">
                    To securely ${isFirstTime ? 'create' : 'reset'} your password, please click the button below.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${actionLink}" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                        ${isFirstTime ? 'Set My Password' : 'Reset My Password'}
                    </a>
                </div>
                <p style="color: #d9534f; font-weight: bold; font-size: 14px;">
                    ⚠️ This link is valid for 20 minutes only.
                </p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #888;">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    <span style="color: #007bff;">${actionLink}</span>
                </p>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully: " + info.response);
        return info;
    } catch (error) {
        console.error("Nodemailer Error: ", error);
        throw error; // Throw so the router can catch it
    }
};