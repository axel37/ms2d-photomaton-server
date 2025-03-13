import Pictures from "./Pictures.ts";
import PictureNotFoundError from "./Errors/PictureNotFoundError.ts";
import InvalidEmailError from "./Errors/InvalidEmailError.ts";
import type {CreateEmailResponse, CreateEmailResponseSuccess, ErrorResponse} from "resend";
import ResendMailer from "./ResendMailer.ts";
import {Resend} from "resend";
import MailSendFailureError from "./Errors/MailSendFailureError.ts";
import MailSendSuccess from "./Errors/MailSendSuccess.ts";

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
        if (result.error != null) {
            return new MailSendFailureError(result.error);
        }
        if (result.data != null) {
            return new MailSendSuccess(result.data);
        }
    }

    private static async doSend(email: string): Promise<CreateEmailResponse> {
        return ResendMailer.send(email);
    }

    /**
     * Naive email checker
     */
    private static isEmailValid(email: string): boolean {
        return email.length > 5 && email.includes("@") && email.includes(".");
    }
}