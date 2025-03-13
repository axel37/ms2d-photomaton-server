import type {ErrorResponse} from "resend";

export default class MailSendFailureError {
    constructor(public error: ErrorResponse) {
        this.error = error;
    }
}