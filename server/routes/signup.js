const express = require("express");
const router = express.Router();

const { upload } = require("../middlewares/multer_middleware");
const { signupUser } = require("../controllers/AuthController");

router.post("/", upload.single("profilePic"), signupUser);

module.exports = router;