import PictureNotFoundError from "./Errors/PictureNotFoundError.ts";
import type {BunFile} from "bun";
import Config from "./Config.ts";

export default class Pictures {
    static async findPicture(pictureNumber: number): Promise<PictureNotFoundError | BunFile> {
        const path = Config.picturesPath;

        const file = Bun.file(`${path}/${pictureNumber}.jpg`);

        if (await file.exists())
        {
            return file;
        }

        return new PictureNotFoundError();
    }
}