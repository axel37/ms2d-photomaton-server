import type {BunFile} from "bun";

export default class  TestFileCreator {
    static async createTestPicture(number: number, path: string): Promise<BunFile> {
        // Ensure path ends in /
        if (!path.endsWith("/")) {
            path += "/";
        }
        const validPicturePath = `${path}${number}.jpg`;
        await Bun.write(validPicturePath, "some test file");
        return Bun.file(validPicturePath);
    }
}