const express=require("express")
const mongoose = require("mongoose")
//const methodOverride = require("method-override")
const bodyParser=require("body-parser")
const ExpressError = require("./middleware/error-handling/ExpressError")
const jobRouter=require("./routes/jobRoutes")
const cvRouter=require("./routes/cvRoutes")
const userAuthRouter=require("./routes/userAuth")
const companyAuthRouter=require("./routes/companyAuth")



const app=express()

app.use(express.json());
//app.use(methodOverride("_method"));
app.use(bodyParser.json())


// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, PATCH, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type", "Authorization");
//   next();
// });

//routes


app.use('/job',jobRouter)
app.use('/cv',cvRouter)
app.use('/userAuth',userAuthRouter)
app.use('/companyAuth',companyAuthRouter)


app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});


app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (err.isJoi) statusCode = 422;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).json({
    message: err.message,
    statusCode,
  });
});

mongoose
  .connect("mongodb+srv://abdalrahman:abd12345@sha3r.sbpmo.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
     console.log("app listening on port 3000!");
    app.listen(3000);
  })
  .catch((err) => console.log(err));