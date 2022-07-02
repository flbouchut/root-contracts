var express = require("express")
const { apiRoute } = require("./controller/route")

const app = express();

app.use(express.json());
app.use('/health', require('express-healthcheck')());
app.use('/', apiRoute)

app.listen(5007, ()=>{
    console.log(
      `Server running on port: 5007`
    );
});