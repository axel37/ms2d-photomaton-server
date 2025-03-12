import Pictures from "./Pictures.ts";
import PictureNotFoundError from "./Errors/PictureNotFoundError.ts";
import InvalidEmailError from "./Errors/InvalidEmailError.ts";

export default class Mailer {
    static async send(pictureNumber: number, email: string): Promise<PictureNotFoundError> {
        if (!this.isEmailValid(email)) {
            return new InvalidEmailError();
        }

        const picture = await Pictures.findPicture(pictureNumber);
        if (picture instanceof PictureNotFoundError) {
            return picture;
        }
    }

    /**
     * Naive email checker
     */
    private static isEmailValid(email: string): boolean {
        return email.length > 5 && email.includes("@") && email.includes(".");
    }
}