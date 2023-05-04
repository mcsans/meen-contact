// Require
const express = require('express'); // EJS
const { body, validationResult, check } = require('express-validator'); // Validasi
const methodOverride = require('method-override');  // Method Override

// Flash Message
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

// mongoose
require('./utils/db');
const Contact = require('./model/contact');

const app = express();
const port = 3000;

// Konfigurasi / setup
app.set('view engine', 'ejs');  // EJS
app.use(express.static('public'));  // Built-in middleware
app.use(express.urlencoded({ extended: true }));  // Built-in middleware, untuk proses tambah data contact

// setup method override
app.use(methodOverride('_method'));

// Konfigurasi Flash Message
app.use(cookieParser('secret'));
app.use(session({
  cookie: { maxAge: 6000 },
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

// Routing
app.get('/', (req, res) => {
  res.render('index', { title: 'Halaman Home', nama: 'Moch Ihsan Saepulloh' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'Halaman About' });
});

// halaman contact (getAll)
app.get('/contact', async (req, res) => {
  const contacts = await Contact.find();

  res.render('contact', { 
    title: 'Halaman Contact',
    contacts,
    msg: req.flash('msg') // Flash Messange
  });
});

// halaman form tambah contact (insert)
app.get('/contact/add', (req, res) => {
  res.render('add-contact', { 
    title: 'Form Tambah Contact',
  });
});

// proses tambah data contact (insert)
app.post('/contact', [
  // rules validation
  body('nama').custom(async (value) => {
    const duplikat = await Contact.findOne({ nama: value });
    if(duplikat) {
      throw new Error('Nama contact sudah digunakan.');
    }

    return true;
  }),
  check('email', 'Email tidak valid.').isEmail(),
  check('nohp', 'No HP tidak valid.').isMobilePhone('id-ID'),
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.render('add-contact', { 
      title: 'Form Tambah Contact',
      errors: errors.array()
    });
  } else {
    Contact.insertMany(req.body, (error, result) => {
      req.flash('msg', 'Data contact berhasil ditambahkan.');
      res.redirect('/contact');
    });
  }
});

// // proses hapus contact (delete)
// app.get('/contact/delete/:nama', async (req, res) => {
//   const contact = await Contact.findOne({ nama: req.params.nama });
  
//   // jika contact tidak ada
//   if (!contact) {
//     res.status(404);
//     res.send('<h1>404</h1>');
//   } else {
//     Contact.deleteOne({ _id: contact._id }).then((result) => {
//       req.flash('msg', 'Data contact berhasil dihapus.');
//       res.redirect('/contact');
//     });
//   }
// });

// proses hapus contact (delete)
app.delete('/contact', (req, res) => {
  Contact.deleteOne({ nama: req.body.nama }).then((result) => {
    req.flash('msg', 'Data contact berhasil dihapus.');
    res.redirect('/contact');
  });
});

// halaman form ubah contact (update)
app.get('/contact/edit/:nama', async (req, res) => {
  const contact = await Contact.findOne({ nama: req.params.nama });

  res.render('edit-contact', { 
    title: 'Form Ubah Contact',
    contact
  });
});

// proses ubah data contact (update)
app.put('/contact', [
  // rules validation
  body('nama').custom(async (value, { req }) => {
    const duplikat = await Contact.findOne({ nama: value });
    if(duplikat && value !== req.body.oldNama) {
      throw new Error('Nama contact sudah digunakan.');
    }

    return true;
  }),
  check('email', 'Email tidak valid.').isEmail(),
  check('nohp', 'No HP tidak valid.').isMobilePhone('id-ID'),
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.render('edit-contact', { 
      title: 'Form Ubah Contact',
      errors: errors.array(),
      contact: req.body
    });
  } else {
    Contact.updateOne(
      { _id: req.body._id },
      {
        $set: {
          nama: req.body.nama,
          nohp: req.body.nohp,
          email: req.body.email,
        }
      }
    ).then((result) => {
      req.flash('msg', 'Data contact berhasil diubah.');
      res.redirect('/contact');
    });
  }
});

// halaman detail contact (getById)
app.get('/contact/:nama', async (req, res) => {
  const contact = await Contact.findOne({ nama: req.params.nama });
  
  res.render('detail', { 
    title: 'Halaman Detail Contact',
    contact,
  });
});

// pesan koneksi
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});