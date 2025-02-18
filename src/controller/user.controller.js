import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  console.log('email', email);

  if (
    [fullName, email, username, password].some((filed) => filed?.trim() === ' ')
  ) {
    throw new ApiError(400, 'All filed are required');
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, 'User with email or password already exist');
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar file is required');
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (avatar) {
    throw new ApiError(400, 'Avatar file is required');
  }

  const user = await User.create({
    fullName: fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || ' ',
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken',
  );

  if (!createdUser) {
    throw new ApiError(500, 'something went wrong while registering user');
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'user registered successfully'));
});

export { registerUser };

//get user detailed from frontend
//validate user data -empty or wrong formate
//check user already exist or have account:username,email
//check files exist or not -cover and avatar
//upload files on cloudinary
//create user object -create entry in db
//remove password and refresh token from response
//check for user creation
//return response
