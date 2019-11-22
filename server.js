import { Mongoose } from "mongoose";

var MONGODB_URI =process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";



















Mongoose.connect(MONGODB_URI);