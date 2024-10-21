import jwt from "jsonwebtoken";

export const generateTokenAndSetCookies = (user, res) => {
    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    })

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
    })
}