import {createTransport} from "nodemailer";
import SMTPTransport = require("nodemailer/lib/smtp-transport");

export default class GmailMailer {
    static async send(email: string): Promise<SMTPTransport.SentMessageInfo>  {

        console.log(process.env.GMAIL_USERNAME);
        // create reusable transporter object using the default SMTP transport
        const transporter = createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USERNAME,
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        const result = transporter.sendMail({
            from: process.env.GMAIL_USERNAME,
            to: email,
            subject: "Photos FlashMe",
            text: "Retrouvez en pièces jointes vos photos FlashMe.",
        });

        return result;
    }

}