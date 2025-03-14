import PictureNotFoundError from "./Errors/PictureNotFoundError.ts";
import type {BunFile} from "bun";
import Config from "./Config.ts";

export default class Pictures {
    static async findPicture(pictureNumber: string): Promise<PictureNotFoundError | BunFile> {
        const path = Config.picturesPath;

        if (!path) {
            console.error("No pictures path configured");
            return new PictureNotFoundError();
        }

        const file = Bun.file(`${path}/${pictureNumber}.jpg`);

        if (await file.exists())
        {
            return file;
        }
        console.log(`Could not find picture ${pictureNumber}.jpg in path ${path}`);
        return new PictureNotFoundError();
    }
}