import {Router } from "express";
import { loginUser,
         refreshAccessToken,
         registerUser,
         refreshAccessToken,
         changeCurrentPassword,
         updateAccountDetails,
         getCurrentUser,
         updateUserAvatar, 
         updateUserCoverImage,
         getUserChannelProfile,
         getWatchHistory } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser)

//secure route 
router.route("/logout").post(verifyJWT,logoutUser)//when many to pass write another mid, use next
router.route("/refresh-token").post(refreshAccessToken)
router.route("/changed-password").post(verifyJWT, changeCurrentPassword)
router.route("/change-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("/coverImage"),updateUserCoverImage)
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)
export default router