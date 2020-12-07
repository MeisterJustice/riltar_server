const mongoose = require('mongoose');

exports.connectDb = async (string) => {
    await mongoose.connect(string, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true
    }, (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
    });
}