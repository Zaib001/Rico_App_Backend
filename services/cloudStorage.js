const admin = require("firebase-admin");
const serviceAccount = require("../config/Firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET, 
});

const bucket = admin.storage().bucket();

exports.uploadFile = async (file) => {
  const filename = `${Date.now()}_${file.originalname}`;
  const fileUpload = bucket.file(filename);

  try {
    await fileUpload.save(file.buffer, {
      contentType: file.mimetype,
    });

    // Make the file publicly accessible
    await fileUpload.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    console.log('File uploaded to:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error uploading to Firebase:', error);
    throw new Error('Upload failed');
  }
};
