import {Router } from "express";
import { loginUser, refreshAccessToken, registerUser, refreshAccessToken } from "../controllers/user.controller.js";
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
export default router