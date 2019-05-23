var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testapi', { useMongoClient: true }).then(() => {
console.log("Connected to Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});