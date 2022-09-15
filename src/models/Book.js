const mongoose = require("mongoose");

const Book = mongoose.model("Book", {
    name: String,
    dateInitial: Date,
    dateFinal: Date,
    read: Boolean,
    haveBook: Boolean,
    image: String,
    pages: Number,
    readingTime: Number,
    idUser: String
})

module.exports = Book