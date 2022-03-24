import * as Multer from "multer";
import admin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";

var serviceAccount = require("../firebase-admin-sdk.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://cookie-fbae5.appspot.com",
});

const bucket = getStorage().bucket();
bucket.makePublic();

export const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    },
});

export const uploadImageToStorage = (file: Express.Multer.File) => {
    if (!file) {
        throw new Error("No image file");
    }

    let newFileName = `${file.originalname}_${Date.now()}`;
    let fileUpload = bucket.file(newFileName);
    let url;

    const blobStream = fileUpload.createWriteStream({
        metadata: {
            contentType: file.mimetype,
        },
    });

    // return `https://storage.googleapis.com/${bucket.name}/${newFileName}`;

    blobStream.on("error", (error) => {
        throw new Error("Something is wrong! Unable to upload at the moment.");
    });

    blobStream.on("finish", () => {
        console.log("On Function");
        // The public URL can be used to directly access the file via HTTP.
    });
    url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
    console.log(url);
    blobStream.end(file.buffer);
    return url;
};
