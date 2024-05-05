const { uploadToS3 } = require('../utils/awsS3.js');
const multer = require('multer');
const User = require('../models/userModel.js');

const multerStorage = multer.memoryStorage();

const filter = (req, file, cb) => {
  console.log(file.mimetype)
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  }
  else {
    cb(new Error("Not an image! please upload only images"), false);
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: filter
})

exports.uploadImage = upload.single("image")


const uploadProfilePictureToS3 = async (file, userId) => {
  try {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${Date.now()}-${file.originalname}`,
      Body: file.buffer,
    };

    const imageUrl = await uploadToS3(params);

    // Update the user's profile with the image URL
    await User.findByIdAndUpdate(userId, { image: imageUrl });

    return imageUrl;
  } catch (error) {
    console.error('Error uploading profile picture to S3:', error);
    throw new Error('Failed to upload profile picture to S3');
  }
};

exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file || !req.user) {
      return res.status(400).json({ message: 'Invalid request, missing file or user information' });
    }

    const imageUrl = await uploadProfilePictureToS3(req.file, req.user._id);
    return res.status(200).json({ message: 'Profile picture uploaded successfully', imageUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};