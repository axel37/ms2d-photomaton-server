import { expect, test } from "bun:test";
import Config from "../src/Config.ts";
import Pictures from "../src/Pictures.ts";
import PictureNotFoundError from "../src/Errors/PictureNotFoundError.ts";
import type {BunFile} from "bun";
import Mailer from "../src/Mailer.ts";
import InvalidEmailError from "../src/Errors/InvalidEmailError.ts";



/**
 * Test the ability to configure pictures directory.
 * Tests Config class and env var retrieval.
 * TODO : Should test that the directory exists
 */
test("Configure picture directory", async () => {
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

/**
 * Test the ability to retrieve pictures by their number.
 */
test("Get picture from number", async () => {
    // Case 1 : picture does not exist, return error
    const invalidPictureNumber = 999;
    const failingResult = await Pictures.findPicture(invalidPictureNumber);
    expect(failingResult).toBeInstanceOf(PictureNotFoundError);

    // Case 2 : picture exists, return picture
    const validPictureNumber = 356;
    process.env.PICTURES_PATH = 'temp/';
    const validPicturePath = `temp/${validPictureNumber}.jpg`;
    await Bun.write(validPicturePath, "some test file");
    const testPicture = Bun.file(validPicturePath);
    // (make sure that test file was created successfully before proceeding)
    expect(await testPicture.exists()).toBeTrue();

    const result = await Pictures.findPicture(validPictureNumber);
    expect(result).not.toBeInstanceOf(PictureNotFoundError);
    expect(await result.exists()).toBeTrue();

    // Cleanup - delete test file
    await testPicture.delete();
    // TODO : For some reason, it still exists
    // expect(await testPicture.exists()).toBeFalse();
});

test("Send picture by mail", async () => {
    process.env.PICTURES_PATH = 'temp/';
    const validPictureNumber = 356;
    const validPicturePath = `temp/${validPictureNumber}.jpg`;
    await Bun.write(validPicturePath, "some test file");
    const testPicture = Bun.file(validPicturePath);

    // Case 1 : Picture does not exist, return error
    const invalidPictureNumber = 999;
    const failingResult = await Mailer.send(invalidPictureNumber, "email@example.org");
    expect(failingResult).toBeInstanceOf(PictureNotFoundError);

    // Case 2 : Email is malformed, return error
    const invalidEmail = "email";
    const failingEmailResult = await Mailer.send(1, invalidEmail);
    expect(failingEmailResult).toBeInstanceOf(InvalidEmailError);

    // Case 3 : Picture exists, email OK send picture

    // Case 4 : Multiple pictures, one email

    // Case 5 : One picture, multiple emails

    // Case 6 : Multiple pictures, multiple emails


    // Cleanup : Delete test picture
    await testPicture.delete();
});