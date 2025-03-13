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

export default class Mailer {
    static async send(pictureNumber: number, email: string): Promise<InvalidEmailError | PictureNotFoundError | MailSendFailureError | MailSendSuccess> {
        if (!this.isEmailValid(email)) {
            return new InvalidEmailError();
        }

        const picture = await Pictures.findPicture(pictureNumber);
        if (picture instanceof PictureNotFoundError) {
            return picture;
        }

        const result = await this.doSend(email);

        if (result.rejected.length > 0) {
            return new MailSendFailureError(result.rejected);
        }
        return new MailSendSuccess(result.accepted);
    }

    private static async doSend(email: string): Promise<SMTPTransport.SentMessageInfo> {
        return GmailMailer.send(email);
    }

    /**
     * Naive email checker
     */
    private static isEmailValid(email: string): boolean {
        return email.length > 5 && email.includes("@") && email.includes(".");
    }
}