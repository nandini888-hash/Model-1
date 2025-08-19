import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from  "../utils/Apiresponse.js";

const registerUser= asyncHandler(async (req,res ) => {
   //get user details from fronted
   //validation - not empty
   //check if user already exists: username, email
   //check for images, check for avatar
   //upload them to cloudinary, avatar
   //create user object - create entry in db
   //remove password and refresh token field from response
   // check for user creation 
   //return res


   const {full_name, email, username, password} = req.body
   console.log("email:", email)

   if (
       [full_name, email, username, password].some((field) =>
       field?.trim() === "")
      

   ) {
      throw new ApiError(400, "All fields are required")

   }
   const existedUser = User.findOne({
      $or : [{username}, {email}]
   })

   if(existedUser){
      throw new ApiError(409, "User with email or username already exists")
   }

   const avatarLocalPath = req.files?.avatar[0]?.path; // first objective , is file there or not, it's in server not cloudinary
   const coverImageLocalPath = req.files?.coverImage[0]?.path;

   if(!avatarLocalPath){
      throw new ApiError(400, "Avatar file is required")
   }

   const avatar     = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if(!avatar){
      throw new ApiError(400, "Avatar file is required")
   }
    const user = await User.create({ // database hamesha dusre continent mai hota hai
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase()
   })
   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   )
   if(!createdUser){
      throw new ApiError(500, "something went wrong while registering the user")

   }
   return res.status(201).json(
      new ApiResponse(200, createdUser, "User registered successfully")

   )
})

export { 
   registerUser,

}