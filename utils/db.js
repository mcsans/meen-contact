const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/nodejs', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

// // Membuat schema / collection
// const Contact = mongoose.model('Contact', {
//     nama: {
//         type: String,
//         required: true,
//     },
//     nohp: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//     },
// });

// // Menambah 1 data
// const contact1 = new Contact({
//     nama: 'Moch Ihsan Saepullloh',
//     nohp: '08995754988',
//     email: 'mihsansaepulloh9@gmail.com',
// });

// // Simpan ke collection
// contact1.save().then((contact) => console.log(contact));