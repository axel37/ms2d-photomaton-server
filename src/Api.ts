import Mailer from "./Mailer/Mailer.ts";
import InvalidEmailError from "./Errors/InvalidEmailError.ts";
import MailSendSuccess from "./Errors/MailSendSuccess.ts";
import PictureNotFoundError from "./Errors/PictureNotFoundError.ts";
import MailSendFailureError from "./Errors/MailSendFailureError.ts";

export default class Api {
    // Server-side code
    static async sendPictureByMail(params: {pictures: string | string[], emails: string | string[]}): Promise<Response> {
        const pictures = params.pictures;
        const emails = params.emails;

        console.log("Sending pictures:", pictures);
        console.log("To emails:", emails);

        const result = await Mailer.send(pictures, emails);
        console.log("Mailer result :", result);

        switch (true) {
            case result instanceof InvalidEmailError:
                return new Response("Invalid email address", {status: 400});
            case result instanceof PictureNotFoundError:
                return new Response("Picture not found", {status: 404});
            case result instanceof MailSendFailureError:
                return new Response("Error while sending email", {status: 500});
            case result instanceof MailSendSuccess:
                return new Response("Successfully sent", {status: 200});
            default:
                return new Response("Unreachable code path reached", {status: 500});
        }
    }
}