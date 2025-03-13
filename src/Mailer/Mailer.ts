import Pictures from "../Pictures.ts";
import PictureNotFoundError from "../Errors/PictureNotFoundError.ts";
import InvalidEmailError from "../Errors/InvalidEmailError.ts";
import type {CreateEmailResponse, CreateEmailResponseSuccess, ErrorResponse} from "resend";
import ResendMailer from "./ResendMailer.ts";
import {Resend} from "resend";
import MailSendFailureError from "../Errors/MailSendFailureError.ts";
import MailSendSuccess from "../Errors/MailSendSuccess.ts";
import GmailMailer from "./GmailMailer.ts";
import SMTPTransport = require("nodemailer/lib/smtp-transport");
import type {BunFile} from "bun";

export default class Mailer {
    static async send(pictureNumber: string|Array<string>, email: string|Array<string>): Promise<InvalidEmailError | PictureNotFoundError | MailSendFailureError | MailSendSuccess> {
        // Handle array of emails
        if (typeof email === "string") {
            email = [email];
        }
        for (const address of email) {
            if (!this.isEmailValid(address)) {
                return new InvalidEmailError();
            }
        }

        // Handle array of numbers
        if (typeof pictureNumber === "string") {
            pictureNumber = [pictureNumber];
        }

        const pictures = [];
        for (const number of pictureNumber) {
            const picture = await Pictures.findPicture(number);
            if (picture instanceof PictureNotFoundError) {
                return picture;
            }
            pictures.push(picture);
        }

        const result = await this.doSend(email, pictures);

        if (result.rejected.length > 0) {
            return new MailSendFailureError(result.rejected);
        }
        return new MailSendSuccess(result.accepted);
    }

    private static async doSend(email: Array<string>, pictures: Array<BunFile>): Promise<SMTPTransport.SentMessageInfo> {
        return GmailMailer.send(email, pictures);
    }

    /**
     * Naive email checker
     */
    private static isEmailValid(email: string): boolean {
        return email.length > 5 && email.includes("@") && email.includes(".");
    }
}