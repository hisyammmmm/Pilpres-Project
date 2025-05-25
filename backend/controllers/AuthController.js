import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { nik, name, email, password, role } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ nik, name, email, password: hashed, role });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) return res.status(404).json({ msg: "User not found" });
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) return res.status(401).json({ msg: "Wrong password" });

        const userData = { id: user.id, email: user.email, name: user.name, role: user.role };
        const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
        const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });

        await User.update({ refresh_token: refreshToken }, { where: { id: user.id } });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

export const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const user = await User.findOne({ where: { refresh_token: refreshToken } });
    if (!user) return res.sendStatus(204);
    await User.update({ refresh_token: null }, { where: { id: user.id } });
    res.clearCookie("refreshToken");
    res.sendStatus(200);
};
