import { expect, test } from "bun:test";
import Config from "../src/Config.ts";

test("Configure picture directory", () => {
    expect(process.env.PICTURES_PATH).toBeUndefined();

    // Step 1 : No env var set, must return default value
    expect(Config.picturesPath).toEqual('pictures/');

    // Step 2 : Set env var, which would usually be in .env
    const envPath = '/path/to/pictures';
    process.env.PICTURES_PATH = envPath;

    // Step 3 : Retrieve directory from configuration, which must match what was previously set
    const configPath = Config.picturesPath;
    expect(configPath).toEqual(envPath);
});

test.todo("Get picture from file name", () => {
    const pictureNumber = 356;
    // Case 1 : picture does not exist, return error

    // Case 2 : picture exists, return picture
    // TODO : Create test data : picture file
});

test.todo("Send picture by mail", () => {

});