import { expect, test } from "bun:test";
import TestFileCreator from "./TestFileCreator.ts";
import Api from "../src/Api.ts";

test("Receive request to send picture by email", async () => {
    // Case 1 : picture does not exist, respond with error
    const invalidPictureNumber = 999;
    const result = await Api.sendPictureByMail({pictures: invalidPictureNumber, emails: "mail@example.org"});
    expect(result.status).toEqual(404);

    // Case 2 : email has incorrect format, respond with error
    const picturesPath = 'temp/';
    process.env.PICTURES_PATH = picturesPath;
    const validPictureNumber = 100;
    const picture = await TestFileCreator.createTestPicture(validPictureNumber, picturesPath);
    const invalidEmail = "invalidemail";
    const invalidEmailResult = await Api.sendPictureByMail({pictures: validPictureNumber, emails: invalidEmail});
    expect(invalidEmailResult.status).toEqual(400);

    // Case 2 : picture exists, send email and respond with success
    const validEmail = "mail@example.org";
    const successResult = await Api.sendPictureByMail({pictures: validPictureNumber, emails: validEmail});
    expect(successResult.status).toEqual(200);

    // Case 3 : multiple emails
    const emails = ["mail1@example.org", "mail2@example.org"];
    const multipleEmailsSuccessResult = await Api.sendPictureByMail({pictures: validPictureNumber, emails: emails});
    expect(multipleEmailsSuccessResult.status).toEqual(200);

    // Cleanup
    await picture.delete();
});