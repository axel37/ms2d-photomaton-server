import {CreateEmailResponse, Resend} from "resend";

export default class ResendMailer {
    static async send(email: string): Promise<CreateEmailResponse> {
        // TODO : Utiliser Config
        const resend = new Resend(process.env.RESEND_API_KEY);

        const sentEmail = await resend.emails.send({
            from: 'FlashMe <flashme@example.com>',
            to: [email],
            subject: 'Photos FlashMe',
            html: '<p>Retrouvez en pièce jointe vos photos FlashMe.</p>',
        });

        return sentEmail;
    }
}