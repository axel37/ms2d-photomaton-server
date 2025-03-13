import type {CreateEmailResponseSuccess} from "resend";

export default class MailSendSuccess {
    constructor(public data: CreateEmailResponseSuccess) {
        this.data = data;
    }
}