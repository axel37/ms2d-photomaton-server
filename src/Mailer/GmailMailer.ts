import {createTransport} from "nodemailer";
import SMTPTransport = require("nodemailer/lib/smtp-transport");
import type {BunFile} from "bun";
import Mail = require("nodemailer/lib/mailer");

export default class GmailMailer {
    static async send(email: Array<string>, fileAttachments: Array<BunFile>): Promise<SMTPTransport.SentMessageInfo>  {
        // create reusable transporter object using the default SMTP transport
        const transporter = createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "boulet.jeremy4@gmail.com",
                pass: "",
            },
        });

        const photos = []
        for (const file of fileAttachments) {
            const attachment = {
                filename: file.name,
                content: Buffer.from(await file.arrayBuffer()),
            };
            photos.push(attachment);
        }

        const result = transporter.sendMail({
            from: process.env.GMAIL_USERNAME,
            to: email,
            subject: "Photos FlashMe",
            text: "Retrouvez en pièces jointes vos photos FlashMe.",
            attachments: photos,
        });

        return result;
    }

}