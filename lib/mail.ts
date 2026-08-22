import nodemailer from 'nodemailer'

interface SendOtpOptions {
  email: string
  otp: string
  name?: string
}

export async function sendOtpEmail({ email, otp, name }: SendOtpOptions) {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = parseInt(process.env.SMTP_PORT || '465')
  const user = process.env.SMTP_USER || process.env.GMAIL_USER
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD
  const from = process.env.SMTP_FROM || `"Funtroo" <${user || 'noreply@funtroo.in'}>`

  // In development without SMTP credentials, log OTP to console for effortless testing
  if (!user || !pass) {
    console.log('\n==========================================')
    console.log(`📨 [OTP EMAIL SIMULATION]`)
    console.log(`To: ${email}`)
    console.log(`Name: ${name || 'User'}`)
    console.log(`OTP Code: ${otp}`)
    console.log(`Expires in: 10 minutes`)
    console.log('==========================================\n')
    return { success: true, simulated: true }
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    })

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify your Funtroo Account</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #0E0B14; margin: 0; padding: 0; color: #EDE9FE; }
        .container { max-width: 520px; margin: 30px auto; background: #1E1B4B; border-radius: 16px; border: 1px solid #7C3AED; overflow: hidden; }
        .header { background: #0E0B14; padding: 25px; text-align: center; border-bottom: 1px solid #2D2235; }
        .logo { font-size: 28px; font-weight: 700; color: #EDE9FE; letter-spacing: 4px; text-decoration: none; }
        .logo-accent { color: #A855F7; }
        .content { padding: 35px 30px; text-align: center; }
        .title { font-size: 22px; font-weight: 600; color: #FFFFFF; margin-bottom: 12px; }
        .text { font-size: 14px; color: #A78BFA; line-height: 1.6; margin-bottom: 25px; }
        .otp-box { background: #0E0B14; border: 2px dashed #A855F7; border-radius: 12px; padding: 18px; display: inline-block; margin-bottom: 25px; }
        .otp-code { font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #A855F7; }
        .badge { display: inline-block; background: rgba(168, 85, 247, 0.15); color: #EDE9FE; font-size: 12px; padding: 6px 14px; border-radius: 20px; margin-bottom: 20px; }
        .footer { background: #0E0B14; padding: 20px; text-align: center; font-size: 11px; color: #6B7280; border-top: 1px solid #2D2235; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">FUN<span class="logo-accent">troo</span></div>
        </div>
        <div class="content">
          <div class="badge">🎁 Free Silver Loyalty Card on Sign Up</div>
          <h1 class="title">Verify Your Email Address</h1>
          <p class="text">Hello ${name || 'there'},<br>Use the following 6-digit verification code to complete your Funtroo registration.</p>
          <div class="otp-box">
            <span class="otp-code">${otp}</span>
          </div>
          <p class="text" style="font-size: 12px; margin-bottom: 0;">
            This OTP is valid for <strong>10 minutes</strong>.<br>
            If you did not request this code, please ignore this email.
          </p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Funtroo. All rights reserved. Discreet packaging & 100% genuine products.
        </div>
      </div>
    </body>
    </html>
    `

    await transporter.sendMail({
      from,
      to: email,
      subject: `${otp} is your Funtroo Verification Code`,
      text: `Your Funtroo verification code is ${otp}. Valid for 10 minutes.`,
      html: htmlContent,
    })

    return { success: true, simulated: false }
  } catch (error: any) {
    console.error('Error sending OTP email:', error)
    throw new Error(error.message || 'Failed to send OTP email')
  }
}
