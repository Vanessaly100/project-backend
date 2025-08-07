
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const sequelize = require("./config/database");
const {createServer} = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
require("dotenv").config();

require("./cronJobs");
const { initSocket } = require("./lib/socket");


const app = express();
const server = createServer(app);
const io = initSocket(server); 
app.set("io", io);

// CORS Configuration (Allow Frontend & Cookies)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
// const FRONTEND_ORIGIN ="http://localhost:5173";
const allowedOrigins = [FRONTEND_ORIGIN];
 
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use(compression());
app.use(helmet());
app.use(cookieParser());

const errorMiddleware = require("./middlewares/error.middleware");
const  appRouter  = require("./routes/index.router");





app.use("/api", appRouter);
//  Sync Database
sequelize.sync().then(() => {
  console.log("Database synced!");
});



app.get("/", (_req,res) =>{
  res.send(process.env.NODE_ENV)
  console.log(process.env.NODE_ENV)
})


app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.get("/test", (req, res) => {
  res.json({ message: "Server is running!" });
});




app.use(errorMiddleware);




//  Start Server
const PORT = process.env.PORT || 4000;

(() =>{
    try{
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
}
    catch(error){
        console.log(`Error starting server : ${error.message}`);

        process.getMaxListeners(1) //stop execution of the server on that thread
    }
})()



