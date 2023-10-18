const express = require('express')
const app  = express();

app.set('view engine', 'ejs');


app.use(express.static('upload'));


app.use('/', require('./Route/route'))


app.listen(1000,()=>{
    console.log('sever running on http://localhost:1000/ ') 
});