import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import * as env from './common/config'

const server = express();

server.use(cors({
  exposedHeaders: "x-access-token"
}));


server.use(express.json());
server.disable("x-powered-by");
server.use(cookieParser());
server.use(express.urlencoded({ extended: false }));
server.use(bodyParser.urlencoded({ extended: true }))

server.use('/auth', require('./routes/auth'))
server.use('/upload', require('./routes/upload'))

server.use('/post', require('./routes/post'))



mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);


mongoose
  .connect(env.URI as string)
  .then(() => console.log("Da ket noi den database"))
  .catch((error) => console.log("Loi, khong ket noi duoc den DB: ", error));



  
server.listen(env.PORT, () => console.log("Server dang chay"));
