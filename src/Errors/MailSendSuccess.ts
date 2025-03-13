import type {CreateEmailResponseSuccess} from "resend";
import Mail = require("nodemailer/lib/mailer");

export default class MailSendSuccess {
    constructor(public accepted: Array<string | Mail.Address>) {
        this.accepted = accepted;
    }
}