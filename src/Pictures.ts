import PictureNotFoundError from "./Errors/PictureNotFoundError.ts";
import type {BunFile} from "bun";
import Config from "./Config.ts";

export default class Pictures {
    static async findPicture(pictureNumber: number): Promise<PictureNotFoundError | BunFile> {
        const path = Config.picturesPath;

        const file = Bun.file(`${path}/${pictureNumber}.jpg`);

        if (await file.exists())
        {
            console.log("File exists, returning it !")
            return file;
        }

        console.log("File does not exist, returning error !")
        return new PictureNotFoundError();
    }
}