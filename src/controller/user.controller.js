import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const registerUser = asyncHandler (async (req, res) => {
   //get user details from frontend
   // validation - not empty
    // check if user alredy exits : username mail 
    // check for  images , check for avator
    // upload them to cloudinary , avatar
    // create user object - create entery in DB
    // remove password and refress token  filed from response
    // check for user creation
    // retur res

    const {username , email , fullName ,password} = req.body
   
     
   //   if (fullName === "") {
   //    throw new ApiError(400, "fullName is required")
   //   }
   //   if (username === "") {
   //    throw new ApiError(400, "username is required")
   //   }
   //   if (email === "") {
   //    throw new ApiError(400, "email is required")
   //   }
   //   if (password === "") {
   //    throw new ApiError(400, "password is required")
   //   }

     if (!fullName || !username || !email || !password) {
      throw new ApiError(400, "All fields are required")
     }

     const existingUser = await User.findOne({
      $or: [
        { username },
        { email }
      ]
     })
if(existingUser?.email === email){
  throw new ApiError(400, "Email already exists")
}
if(existingUser?.username === username){
  throw new ApiError(400, "Username already exists")
}

 const avatarLocalPath = req.files?.avatar[0]?.path;
 const coverImageLocalPath = req.files?.coverImage[0]?.path;

 if(!avatarLocalPath){
  throw new ApiError(400, "Avatar is required")
 }

 const avatar = await uploadOnCloudinary(avatarLocalPath);
 const coverImage = await uploadOnCloudinary(coverImageLocalPath);

 if(!coverImage){
  throw new ApiError(400, "Cover image is required")
 }

 const user = await User.create({
  username,
  email,
  fullName,
  avatar: avatar.url,
  coverImage: coverImage?.url || "",
  password
 })

 const createdUser = await User.findById(user._id).select(
  "-password -refreshToken");


  if(!createdUser){
    throw new ApiError(500, "Failed to create user")
  }

  return res.status(201).json(
    new ApiResponse(201, createdUser, "User created successfully"))

     console.log(req.body)   



})


export { registerUser }