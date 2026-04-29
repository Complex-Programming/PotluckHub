import express from "express"
import passport from "passport"

const CLIENT_URL = process.env.CLIENT_URL
const router = express.Router()

// create routes to handle login and logout requests
// 1) login successful 2) login failed; 3) logout

router.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({ success: true, user: req.user })
    } else {
        res.status(404).json({ success: false, message: "not login"})
    }
})

router.get("/login/failed", (req, res) => {
    res.status(401).json({ success: true, message: "failure" })
})

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }

        req.session.destroy((err) => {
            res.clearCookie("connect.sid")

            res.json({ status: "logout", user: {} })
        })
    })
})

// implement routes to authenticate user via GitHub
// 1) authenticate user using GitHub strategy
// 2) called once a user logins into GitHub
router.get("/github",
    passport.authenticate('github', {
        scope: ["read:user"]
    })
)

router.get("/github/callback",
    passport.authenticate('github', {
        successRedirect: `${CLIENT_URL}/PotluckHub`,
        failureRedirect: `${CLIENT_URL}/PotluckHub`,
    })
)

export default router;