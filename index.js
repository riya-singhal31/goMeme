const express = require('express');
const fs = require('fs');
const path = require('path');
var multer = require('multer');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

var storage = multer.diskStorage({destination : function(req,file,cb){
    cb(null , 'public/images');
},
     filename: function(req,file,cb){
        cb(null, file.originalname + '-' + Date.now())
}
})

var upload = multer({
    storage : storage,
    fileFilter : fileFilter
})

function fileFilter(req, file, cb)
{
    cb(null, true);
}


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
})



//get request to read the tasks stored
app.get("/getData", (req, res)=>{
    fs.readFile("./data.txt", 'utf-8', function(error, fileData){
        if(error)
          console.log("Error occurred in reading the tasks");
        else
        {
             fileData=fileData.length?JSON.parse(fileData):[];
             res.send(JSON.stringify(fileData));
        }

    });
});

app.post("/update", (req, res)=>{
    console.log(req.body)
  fs.writeFile('./data.txt', JSON.stringify(req.body), (err) => {
        if (err)
            console.log(err);
        else
           console.log("successful");
    });
    res.redirect('/getData')
});

//post request to handle form data
app.post("/upload", upload.single('pic'), (req, res)=>{
    var data = {
        //we are saving the url of files in data.txt
        img : 'images/' + req.file.filename,
        id : Date.now().toString(),
        complete: false,
        name : req.body.text
    };
    fs.readFile("./data.txt", 'utf-8', (err, fileData)=>{
        if(err) console.log(err);
        else{
         fileData = fileData.length ? JSON.parse(fileData) : [];
         fileData.push(data);
         fs.writeFile("./data.txt", JSON.stringify(fileData), (err, fileData)=>{
      if(err)
       console.log("Error occurred in saving the tasks");
      else
       res.end();
          });
        }
    });
    res.redirect("/");
});

app.listen(port, () => {
	console.log(`app listening at http://localhost:${port}`)
})
