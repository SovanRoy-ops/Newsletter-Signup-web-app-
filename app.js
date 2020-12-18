//jshint esversion: 6
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
    
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
      members :[
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName
          }
        }
      ]
    };

    const jsonData = JSON.stringify(data);

    const url = 'https://us2.api.mailchimp.com/3.0/lists/fd1195ba89';
    const options = {
      method: "POST",
      auth: "sovan125:2dbc3ef1c35b74d598cb4b3fdf980b01-us2"
    };

    const request = https.request(url,options,function(response){

      if(response.statusCode === 200){
        res.sendFile(__dirname+"/success.html");
      }
      else{
        res.sendFile(__dirname+"/failure.html");
      }

      response.on("data",function(data){
        console.log(JSON.parse(data));
      });
    });

    request.write(jsonData);
    request.end();

    app.post("/failure",function(req,res){
      res.redirect("/");
    });
});

app.listen(process.env.PORT || 3000,function(){
  console.log("Server started in port 3000");
});


// API KEY
// 45704c348c7ea3da30a8b0b113eeaf95-us2

// List KEY
// fd1195ba89
