const mysql = require("mysql");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",       // Nếu có mật khẩu, thêm vào đây
    password: "",       // Mặc định là trống với XAMPP
    database: "gkweb"   // Đổi thành tên database mới
});

db.connect((err) => {
    if (err) {
        console.error("❌ Kết nối database thất bại:", err);
        return;
    }
    console.log("✅ Kết nối database thành công!");
});

// Xử lý đăng ký user
app.post("/register", async (req, res) => {
    const { username, email, password, passwordconfirm } = req.body;

    if (password !== passwordconfirm) {
        return res.status(400).json({ message: "Mật khẩu xác nhận không trùng khớp!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [username, email, hashedPassword], (err, result) => {
        if (err) {
            console.error("❌ Lỗi khi đăng ký:", err);
            return res.status(500).json({ message: "Bị lỗi khi đăng ký" });
        }
        res.status(201).json({ message: "Đăng ký thành công!" });
    });
});

app.listen(5000, () => {
    console.log("✅ Server đang chạy trên cổng 5000");
});
