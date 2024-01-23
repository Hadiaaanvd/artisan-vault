const functions = require("firebase-functions");
const { nanoid } = require("nanoid");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

type userType = {
  about: string;
  email?: string;
  displayName: string;
  photoURL?: string;
};
type contextType = { auth: { uid: string } };

exports.checkAndUpdateAuth = functions.https.onCall(
  async (
    data: { displayName: string; email: string },
    context: contextType
  ) => {
    if (!context.auth) {
      return { success: false };
    }
    const uid = context.auth.uid;
    const userRef = db.collection("Users").doc(uid);

    try {
      const userRes = await userRef.get();

      if (!userRes.exists) {
        await userRef.set({ ...data }, { merge: true });
      }

      return { success: true };
    } catch (err: any) {
      console.log(err.message);
      return { success: false, message: err.message };
    }
  }
);

exports.updateArtistAbout = functions.https.onCall(
  async (data: userType, context: contextType) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      );
    }

    const uid = context.auth.uid;
    const userRef = db.collection("Users").doc(uid);

    try {
      if (!data.email || !data.displayName || !data.about) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Missing about information."
        );
      }

      let userDetails: userType = data;

      if (data.photoURL) {
        if (/^https?:\/\/.*/.test(data.photoURL)) {
          userDetails.photoURL = data.photoURL;

          console.log("data is a url");
        } else {
          const imageResponse = await imageValidationAndUpload(data.photoURL);
          if (imageResponse.success) {
            userDetails.photoURL = imageResponse.url;
          } else {
            throw new functions.https.HttpsError(
              "invalid-argument",
              "Image validation failed."
            );
          }
        }
      }
      await userRef.update({ ...userDetails });

      const artworks = await db
        .collection("Artwork")
        .where("artist.email", "==", data.email)
        .get();

      let batch = db.batch();
      artworks.forEach((artwork: { id: string }) => {
        let artworkRef = db.collection("Artwork").doc(artwork.id);
        batch.update(artworkRef, { artist: { ...userDetails } });
      });

      await batch.commit();

      return { success: true };
    } catch (err: any) {
      console.error(err);
      throw new functions.https.HttpsError("unknown", err.message);
    }
  }
);

exports.updateArtworkStatus = functions.https.onCall(
  async (data: { id: string; disabled: boolean }, context: contextType) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      );
    }

    const { id, disabled } = data;

    try {
      const artworkRef = db.collection("Artwork").doc(id);
      await artworkRef.update({ disabled });
      return { success: true };
    } catch (error) {
      console.error("Error updating artwork disabled status:", error);
      throw new functions.https.HttpsError(
        "unknown",
        "Failed to update artwork status"
      );
    }
  }
);

//Common functions/ Utils
const validateImageFile = async (size: number, type: string) => {
  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/svg",
    "image/svg+xml",
  ];
  if (validTypes.indexOf(type) === -1) {
    return { success: false, message: "File type not supported" };
  } else if (size >= 1000000) {
    // 1mb limit
    return {
      success: false,
      message: "File size is too large. Max size 1mb",
    };
  }
  return { success: true };
};

const imageValidationAndUpload = async (image: string) => {
  try {
    if (!image) {
      throw new Error("No image found.");
    }

    const bucket = admin.storage().bucket();

    const matches = image.match(/^data:(.*);base64,/);
    const mimeType = matches && matches[1] ? matches[1] : null;
    if (!mimeType) {
      throw new Error("Invalid image data.");
    }

    let fileExtension;
    if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
      fileExtension = "jpg";
    } else if (mimeType === "image/png") {
      fileExtension = "png";
    } else if (mimeType === "image/gif") {
      fileExtension = "gif";
    }
    if (!fileExtension) {
      throw new Error("Could not determine file extension.");
    }

    const fileName = `${nanoid()}.${fileExtension}`;

    const base64EncodedImageString = image.replace(/^data:.*;base64,/, "");

    const imageBuffer = Buffer.from(base64EncodedImageString, "base64");

    const result = await validateImageFile(imageBuffer.length, mimeType);

    if (result.success) {
      // Create a token and metadata for the file
      const token = nanoid();
      const options = {
        gzip: true,
        metadata: {
          contentType: mimeType,
          metadata: {
            firebaseStorageDownloadTokens: token,
          },
        },
      };

      // Create file path and save the buffer to storage
      const filePath = `images/${fileName}`;
      const file = bucket.file(filePath);
      await file.save(imageBuffer, options);

      // Make the file publicly accessible
      await file.makePublic();

      // Get the public URL of the file
      const [metadata] = await file.getMetadata();
      const fileURL = metadata.mediaLink;

      return { success: true, url: fileURL };
    } else if (image.match(/^https?:\/\/.*/)) {
      // A simple regex to match URLs
      return { success: true, url: image };
    } else {
      throw new Error(result.message);
    }
  } catch (err: any) {
    console.error("Error during image upload and validation:", err.message);
    return { success: false, message: err.message };
  }
};
