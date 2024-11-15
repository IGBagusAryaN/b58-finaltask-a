const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const config = require("./config/config");
const { QueryTypes, Sequelize } = require("sequelize");
const sequelize = new Sequelize(config.development);
const bcrypt = require('bcrypt');
const session = require("express-session");
const flash = require("express-flash");
const upload = require("./src/middlewares/upload-file");


app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set('views', path.join(__dirname, './src/views'));
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
      name: "my-session",
      secret: "rahasiabangetdehjangansampaiadayangtahu",
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24, 
      },
    })
);

app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.messages = req.flash(); 
    next();
});

app.get("/", home);
app.post("/", upload.single("image"), CharPost);
app.get("/login", login);
app.post("/login", loginPost);
app.post("/logout", logoutPost);
app.get("/register", register);
app.post("/register", registerPost);
app.post("/logout", logoutPost);
app.post("/delete-Char/:id", CharDelete);
app.get("/edit-char/:id", editChar);
app.post("/edit-char/:id", upload.single("image"), editCharPost);
app.get("/add-type", addTypeForm);
app.post("/add-type", addTypePost);
app.get("/char-detail/:id", CharDetail);


async function home(req, res) {
    const user = req.session.user;

    const query = `
        SELECT tb_heros.*, 
               tb_users.username AS author, 
               tb_types.name AS type_name 
        FROM tb_heros 
        LEFT JOIN tb_users ON tb_heros.user_id = tb_users.id 
        LEFT JOIN tb_types ON tb_heros.type_id = tb_types.id
    `;
    let Chars = await sequelize.query(query, { type: QueryTypes.SELECT });

    const typesQuery = `SELECT * FROM tb_types`;
    let types = await sequelize.query(typesQuery, { type: QueryTypes.SELECT });

    res.render("index", { Chars, types, user, messages: res.locals.messages });
}


function login(req, res) {
    res.render("login", { messages: res.locals.messages });
}

function register(req, res) {
    res.render("register", { messages: res.locals.messages });
}

async function registerPost(req, res) {
    const { name, email, password } = req.body;
    const salt = 10;

    const hashedPassword = await bcrypt.hash(password, salt);

    const query = `INSERT INTO tb_users(username, email, password) VALUES('${name}', '${email}', '${hashedPassword}')`;
    await sequelize.query(query, { type: QueryTypes.INSERT });

    req.flash("success", "Registrasi berhasil. Silakan login.");
    res.redirect("/login");
}

async function loginPost(req, res) {
    const { email, password } = req.body;

    const query = `SELECT * FROM tb_users WHERE email='${email}'`;
    const user = await sequelize.query(query, { type: QueryTypes.SELECT });

    if (!user.length) {
        req.flash("error", "Email atau password salah!");
        return res.redirect("/login");
    }

    const isVerifiedPassword = await bcrypt.compare(password, user[0].password);

    if (!isVerifiedPassword) {
        req.flash("error", "Email atau password salah!");
        return res.redirect("/login");
    }

    req.flash("success", "Berhasil login!");
    req.session.user = user[0];
    res.redirect("/");
}

function logoutPost(req, res) {
    req.session.destroy((err) => {
        if (err) return console.error("Logout gagal!");

        console.log("Logout berhasil!");
        res.redirect("/");
    });
}

async function CharPost(req, res) {
    if (!req.session.user) {
        req.flash("error", "Anda harus login terlebih dahulu!");
        return res.redirect("/login");
    }

    const { name, type_id } = req.body;
    const { id } = req.session.user; 

    let photoPath = null;
    if (req.file) {
        photoPath = req.file.path;
    } else {
        req.flash("error", "File gambar tidak ditemukan.");
        return res.redirect("/"); 
    }

    const query = `
        INSERT INTO tb_heros (name, photo, user_id, type_id) 
        VALUES ('${name}', '${photoPath}', '${id}', '${type_id}')`;

    await sequelize.query(query, { type: QueryTypes.INSERT });
    res.redirect("/");
}

async function CharDelete(req, res) {
    const { id } = req.params;
  
    const query = `DELETE FROM tb_heros WHERE id=${id}`;
    await sequelize.query(query, { type: QueryTypes.DELETE });
  
    req.flash("success", "Proyek berhasil dihapus.");
    res.redirect("/");
}
async function editChar(req, res) {
    const { id } = req.params;

    const query = `SELECT * FROM tb_heros WHERE id=${id}`;
    const Char = await sequelize.query(query, { type: QueryTypes.SELECT });

    if (Char.length > 0) {
        res.render("edit-char", { char: Char[0] });
    } else {
        res.redirect("/");
    }
}
async function editCharPost(req, res) {
    const { id } = req.params;
    const { name } = req.body;

    console.log('Name:', name);  
    const photoPath = req.file ? req.file.path : null;
    console.log('Photo Path:', photoPath);  

    if (!name) {
        return res.status(400).send("Nama karakter harus diisi");
    }

    let query = `
        UPDATE tb_heros
        SET name = '${name}'
    `;

    if (photoPath) {
        query += `, photo = '${photoPath}'`;
    }

    query += ` WHERE id = '${id}'`;

    await sequelize.query(query, {
        type: QueryTypes.UPDATE
    });

    req.flash("success", "Proyek berhasil diperbarui.");
    res.redirect("/");
}


function addTypeForm(req, res) {
    res.render("index", { messages: res.locals.messages });
  }

async function addTypePost(req, res) {
    console.log("Request body:", req.body);
    const { name } = req.body;

    if (!name) {
        req.flash("error", "Nama tipe harus diisi.");
        return res.redirect("/");  
    }

    await sequelize.query(`INSERT INTO tb_types (name) VALUES ('${name}')`);

    req.flash("success", "Tipe baru berhasil ditambahkan.");
    res.redirect("/"); 
}

async function CharDetail(req, res) {
    const { id } = req.params;

    const query = `SELECT * FROM tb_heros WHERE id = :id`;
    const Char = await sequelize.query(query, { 
        type: QueryTypes.SELECT, 
        replacements: { id } 
    });

    if (Char.length > 0) {
        res.render("char-detail", { char: Char[0] });
    } else {
        res.redirect("/");
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});