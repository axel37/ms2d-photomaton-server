import type {ErrorResponse} from "resend";
import Mail = require("nodemailer/lib/mailer");

export default class MailSendFailureError {
    constructor(public rejected: Array<string | Mail.Address>) {
        this.rejected = rejected;
    }
}