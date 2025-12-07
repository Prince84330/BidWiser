import nodeMailer from "nodemailer";

export const sendEmail = async ({email, subject, message}) => {
  // Check if email configuration exists
  if (!process.env.SMTP_HOST || !process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.warn("⚠️  Email configuration missing! Check your config.env file.");
    console.warn("   Required variables: SMTP_HOST, SMTP_EMAIL, SMTP_PASSWORD");
    console.warn("   Email will not be sent. In development, check console for OTP.");
    // Don't throw error - just return false to indicate email wasn't sent
    return { success: false, error: "Email configuration missing" };
  }

  const isDevelopment = process.env.NODE_ENV === "development";
  
  // For development, log email details
  if (isDevelopment) {
    console.log("\n📧 Email Configuration:");
    console.log("   Host:", process.env.SMTP_HOST);
    console.log("   Port:", process.env.SMTP_PORT);
    console.log("   Service:", process.env.SMTP_SERVICE);
    console.log("   From:", process.env.SMTP_EMAIL);
    console.log("   To:", email);
    console.log("   Subject:", subject);
  }

  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    service: process.env.SMTP_SERVICE,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    },
    tls: {
      rejectUnauthorized: false // For development, accept self-signed certificates
    }
  });

  // Verify transporter configuration
  try {
    await transporter.verify();
    if (isDevelopment) {
      console.log("✅ SMTP server connection verified successfully!");
    }
  } catch (verifyError) {
    console.error("❌ SMTP server verification failed:", verifyError.message);
    console.error("   Please check your SMTP configuration in config.env");
    return { success: false, error: `SMTP server connection failed: ${verifyError.message}` };
  }

  const mailOptions = {
    from: `"BidWiser" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: subject,
    text: message,
    html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #d6482b;">${subject}</h2>
      <p style="font-size: 16px;">${message}</p>
      <p style="color: #666; font-size: 12px; margin-top: 20px;">This is an automated message from BidWiser.</p>
    </div>`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    if (isDevelopment) {
      console.log("✅ Email sent successfully!");
      console.log("   Message ID:", info.messageId);
    }
    return { success: true, messageId: info.messageId, info };
  } catch (sendError) {
    console.error("❌ Email sending failed:");
    console.error("   Error:", sendError.message);
    console.error("   Code:", sendError.code);
    console.error("   Response:", sendError.response);
    // Return error instead of throwing - let caller decide how to handle
    return { success: false, error: sendError.message };
  }
};