import { expect, test } from "bun:test";
import Config from "../src/Config.ts";
import Pictures from "../src/Pictures.ts";
import PictureNotFoundError from "../src/Errors/PictureNotFoundError.ts";
import type {BunFile} from "bun";
import Mailer from "../src/Mailer/Mailer.ts";
import InvalidEmailError from "../src/Errors/InvalidEmailError.ts";
import MailSendSuccess from "../src/Errors/MailSendSuccess.ts";
import TestFileCreator from "./TestFileCreator.ts";


/**
 * Test the ability to configure pictures directory.
 * Tests Config class and env var retrieval.
 * TODO : Should test that the directory exists
 */
test("Configure picture directory", async () => {
    process.env.PICTURES_PATH = null;

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
    const path = 'temp/';
    const testPicture = await TestFileCreator.createTestPicture(validPictureNumber, path);
    process.env.PICTURES_PATH = path;
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

// WARNING : This test needs a valid API key
test("Send picture by mail", async () => {
    const picturePath = 'temp/';
    process.env.PICTURES_PATH = picturePath;
    const validPictureNumber = 356;
    const testPicture = await TestFileCreator.createTestPicture(validPictureNumber, picturePath);

    // Case 1 : Picture does not exist, return error
    const invalidPictureNumber = 999;
    const failingResult = await Mailer.send(invalidPictureNumber, "email@example.org");
    expect(failingResult).toBeInstanceOf(PictureNotFoundError);

    // Case 2 : Email is malformed, return error
    const invalidEmail = "email";
    const failingEmailResult = await Mailer.send(1, invalidEmail);
    expect(failingEmailResult).toBeInstanceOf(InvalidEmailError);

    // Case 3 : Picture exists, email OK send picture
    const validEmail = "mail@example.org";
    const okResult = await Mailer.send(validPictureNumber, validEmail);
    // TODO : Should inspect each email that was sent
    expect(okResult).toBeInstanceOf(MailSendSuccess);
    expect(okResult.accepted).toContain('mail@example.org')

    // Case 4 : Multiple pictures, one email
    const validPictureNumbers = [100, 101, 102];
    const picture1 = await TestFileCreator.createTestPicture(validPictureNumbers[0], picturePath);
    const picture2 = await TestFileCreator.createTestPicture(validPictureNumbers[1], picturePath);
    const picture3 = await TestFileCreator.createTestPicture(validPictureNumbers[2], picturePath);

    const multipleResult = await Mailer.send(validPictureNumbers, validEmail);
    expect(multipleResult).toBeInstanceOf(MailSendSuccess);
    // TODO : Test for attachments (here, we don't know if validPictureNumbers worked)

    // Case 5 : One picture, multiple emails
    const validEmails = ['mail1@example.org', 'mail2@example.org', 'mail3@example.org'];
    const multipleEmailResult = await Mailer.send(validPictureNumber, validEmails);
    expect(multipleEmailResult).toBeInstanceOf(MailSendSuccess);
    expect(multipleEmailResult.accepted).toEqual(validEmails);



    // Case 6 : Multiple pictures, multiple emails
    const multipleEverythingResult = await Mailer.send(validPictureNumbers, validEmails);
    expect(multipleEverythingResult).toBeInstanceOf(MailSendSuccess);


    // Cleanup : Delete test picture
    await testPicture.delete();
    await picture1.delete();
    await picture2.delete();
    await picture3.delete();
});