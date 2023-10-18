const router = require('express').Router();;

require('../config/mongocon')
const con = require('../config/model');

const multer = require('multer');
// const upload = multer(); 

const fs =require('fs')


const { DataTable } = require('datatables.net-editor-server');
const bodyParser = require('body-parser');

router.use(bodyParser.json());



// MULTER FUNCTION
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + "_" + Date.now() + ".jpg");
    },
});
const upload1 = multer({
    // limits: { fileSize: 1 * 1024 * 1024 },
    storage: storage,
}).single("file")



router.post('/add',upload1,async (req,res,err)=>{
    
    try{
        const user =  await new con({

            name : req.body.name,
            email : req.body.email,
            mobileno : req.body.mobileno,
            file : req.file.filename    
        })
        if(user != ''){
            await user.save();
            res.redirect('/')
        }
        else{

            res.send(err)
        }
    }
    catch{
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
})







router.get('/', async (req, res) => {
    try {
        const data = await con.find();
        res.render('home', {
            title: "Home Page",
            user: data
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/add',async(req,res)=>{
    res.render('adduser',{title:"add user page "})
})


router.get('/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await con.findById(id);

        if (!result) {
            // User not found
            res.redirect('/');
        } else {
            res.render('edit', {
                title: "Edit the user",
                user: result
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }
});



router.post('/edit/:id',upload1,async (req,res)=>{

    const id = req.params.id;
    let new_img = "";

    if(req.file)
    {
        new_img = req.file.filename; 

        try{
                fs.unlinkSync("./upload/"+ req.body.old_file.trim())
        }
        catch(err){
            console.log(err);
        }
    }
    else{
        new_img = req.body.old_file;
        
    }

    try{       
        const data =await  con.findByIdAndUpdate(id,{
            name: req.body.name,
            email: req.body.email,
            mobileno: req.body.mobileno,
            file: new_img,        
         }) 
         if(data != '')
         {
             console.log(data);
             res.redirect('/');
         }
         else{
             res.send(err)
         }
    }
    catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
})

router.get('/delete/:id',async(req,res)=>{
  
      const id = req.params.id;

    try{    
        const data = await con.findByIdAndRemove(id);    
            
        if(data.file != ''){
            
            fs.unlinkSync("./upload/" + data.file.trim())
           
        }
        else{
            console.log(err)
        }
        
            if (!data) {
                // User not found
                res.redirect('/');
                console.log('can not delete the data')
            } else {
                res.render('home', {
                    title: "Delete the user",
                    user: data
                });
                res.redirect('/');

            }
    } 
    catch(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
    }
})



router.post('/abc', async (req, res) => {
    try {
        // Handle data retrieval or submission here
        const dataTable = new DataTable(req.body);
        await dataTable.exec();

        // Send the response back to DataTables Editor
        res.json(dataTable.toJSON());
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});






module.exports = router;
