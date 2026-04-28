import pool from "./database.js"
import { Strategy as GitHubStrategy } from "passport-github2"
const options = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/api/auth/github/callback'
}


const verify = async (accessToken, refreshToken, profile, callback) => {
    const { _json: { id, name, login, avatar_url } } = profile
    const userData = {
        githubId: id,
        username: login,
        avatarUrl: avatar_url,
        accessToken
    }
    try {
        const results = await pool.query(
            'SELECT * FROM "user" WHERE username = $1',
            [userData.username]
        )
        const user = results.rows[0]

        if (!user) {
            const results = await pool.query(
                `INSERT INTO "user" (githubid, username, avatarurl, accesstoken, bio)
                VALUES($1, $2, $3, $4, $5)
                RETURNING *`,
                [userData.githubId, userData.username, userData.avatarUrl, accessToken, ""]
            )

            const newUser = results.rows[0]
            return callback(null, newUser)
        }

        return callback(null, user)
    } catch (error) {
        return callback(error)
    }
}

export const GitHub = new GitHubStrategy(options, verify)