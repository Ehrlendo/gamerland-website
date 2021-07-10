var express = require('express');
var router = express.Router();
const util = require("minecraft-server-util");
const mysql = require("mysql");
const useragent = require("express-useragent");
const { Pool, Client } = require("pg");
const session = require("express-session");


var pool;
if(process.env.DEVELOPMENT) {
  console.log("iojubasjbdbiasdibja")

  pool = new Pool({
    host: 'localhost',
    user: process.env.LUSR,
    password: process.env.LPASS,
    database: process.env.LDB,
    port: process.env.LPORT
  })
} else {

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{
      rejectUnauthorized: false
    }
  })
}
  
pool.on("error", (err, client) => {
  console.log("Unexpected error ", err);
  process.exit(-1);
})



const escapeHTML = str =>
  str.replace(
    /[&<>'"]/g,
    tag =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
  );

/* GET home page. */
router.get('/', function(req, res, next) {
  var source = req.headers['user-agent'];
  var ua = useragent.parse(source);
  if(ua.isFirefox) {
    res.render('index', {warning: 'Denne nettleseren er ikke støttet. Prøv Google Chrome.'})
  }
  res.render('index', {warning: ''});
});

router.post("/register", function(req, res) {
  //Perform sanitation
  var gamename = escapeHTML(req.body.usrName.trim());
  var discname = escapeHTML(req.body.discord.trim());

  pool.connect((err, client, done) => {
    if(err) throw err;
    client.query("INSERT INTO users (username,dcname) VALUES($1, $2);", [gamename, discname], (err, resu) => {
      done()
      if (err) {
        console.log(err.stack)
        res.status(500).send({message:err})
      } else {
        if(resu.rows.length == 0) {
          res.status(200).send({message:"OK"})
        } else {
          res.status(500).send({message:"Error"})
        }
      }
    })
  })
})
console.log(process.env.SERVERPASS);
const client = new util.RCON('88.88.177.131', {port:25575,enableSRV:true,timeout:50,password:process.env.SERVERPASS});
var io;
setTimeout(()=>{
  io = require("../bin/www").io;
  console.log(io);
}, 1000)
client.on('output', (message) => {
  io.emit("minecraft-server-console", message);
  client.close();
})


function runConsoleCommand(command) {
  return new Promise((resolve, reject) => {
    if(command.trim().length == 0) reject("No command!");
    client.connect()
    .then(()=>{client.run(command); resolve();})
    .catch((error)=>{
      console.error(error);
      reject(error)
    })
  })
}
setTimeout(()=>{

  module.exports.runCommand = runConsoleCommand;
}, 1000);

router.post("/consoleCommand", async function(req, res) {
  if(!req.session.adminAuthed) {res.status(503).send({message:"not authorized!"})}
  //Perform sanitation
  var command = req.body.command.trim().length!=0 ? req.body.command : undefined;
  runConsoleCommand(command)
  .then(()=>{
    res.status(200).send();
  })
  .catch((error)=>{
    res.status(500).send()
  })
})




router.post("/updateUserList", async function(req, res) {
  if(!req.session.adminAuthed) {res.status(503).send({message:"not authorized!"})}
  //Perform sanitation
  var acceptedList = req.body.accepted.trim().length!=0 ? JSON.parse(req.body.accepted) : undefined;
  var rejectedList = req.body.rejected.trim().length!=0 ? JSON.parse(req.body.rejected) : undefined;
  function runServerCommand(usrname) {
      client.connect()
      .then(()=>{client.run('whitelist add ' + usrname)})
      .catch((error)=>{
        console.error(error);
      })
  }
  
  
  try {
    var x;
    if(acceptedList) {
      for(x of acceptedList) {
        await sendAccepted(x);
        runServerCommand(x.usrname);
      }  
    }

    var y;
    if(rejectedList) {

      for(y of rejectedList) {
        await removeUser(y);
      }
    }
    
  } catch (error) {
    res.status(500).send();
    return;
  }


  async function sendAccepted(x) {
    return new Promise((resolve, reject) =>{

      pool.connect((err, client, done) => {
        if(err) throw err;
        client.query("UPDATE users SET accepted=true WHERE username=$1 AND id=$2 AND dcname=$3;", [x.usrname, x.id,x.dcname], (err, resu) => {
          done()
          if (err) {
            console.log(err.stack)
            reject(err);
          } else {
            resolve()
          }
        })
      });
    })
  }

  async function removeUser(x) {
    return new Promise((resolve, reject) =>{

      pool.connect((err, client, done) => {
        if(err) throw err;
        client.query("DELETE FROM users WHERE username=$1 AND id=$2 AND dcname=$3 AND accepted=false;", [x.usrname, x.id,x.dcname], (err, resu) => {
          done()
          if (err) {
            console.log(err.stack)
            reject(err);
          } else {
            resolve()
          }
        })
      });
    })
  }

  res.status(200).send();

})


router.get("/applyList", function(req, res) {
  if(!req.session.adminAuthed) return; //dont allow query if the user is not authenticated

  pool.connect((err, client, done) => {
    if(err) throw err;
    //"SELECT * FROM passwords WHERE adminpassword=crypt($1, gen_salt('bf',8)) AND eier=$2"
    client.query("SELECT * FROM users WHERE accepted=false;", (err, resu) => {
      done()
      if (err) {
        res.status(500).send({message:err})
      } else {
        if(resu.rows.length > 0) {
          res.status(200).send(resu.rows);
        } else {
          res.status(204).send({message:"No users in database fits the query"});
        }
      }
    })
  })
})


function authCommand(key) {
  return new Promise((resolve,reject) => {
    pool.connect((err, client, done) => {
      if (err) throw err;
      client.query("SELECT adminpassword=crypt($1, adminpassword) AND eier=$2 FROM passwords;",[key,'erlend'], (err, resu) => {
        done()
        if (err) {
          console.log(err.stack)
          reject(err);
        } else {
          if(resu.rows[0]['?column?'] == true) {
            resolve();
          } else {
            console.log("WRONG ADMIN CREDENTIALS")
            reject("Not ok");
          }
        }
      })
    })
  })
}
setTimeout(()=>{

  module.exports.authCommand = authCommand;
}, 1000)
  


router.post("/adminAuth", function(req, res) {
  if(req.session.adminAuthed) {
    //The client is already verified, let him/her have access to the admin 
    res.status(200).send({message:'Already authenticated'});
  }

  //Perform sanitation
  var pass = escapeHTML(req.body.password.trim());
  if(pass.trim().length == 0 || !pass) {
    res.status(401).send({message:'Password empty, or not accepted'});
  }
  pool.connect((err, client, done) => {
    if(err) throw err;
    //"SELECT * FROM passwords WHERE adminpassword=crypt($1, gen_salt('bf',8)) AND eier=$2"
    client.query("SELECT adminpassword=crypt($1, adminpassword) AND eier=$2 FROM passwords;",[pass,'erlend'], (err, resu) => {
      done()
      if (err) {
        console.log(err.stack)
        res.status(500).send({message:err})
      } else {
        if(resu.rows[0]['?column?'] == true) {
          req.session.adminAuthed = true;
          res.status(200).send({message:"ACCEPTED"})
        } else {
          res.status(401).send({message:"DENIED ENTRY"})
        }
      }
    })
  })
})




router.get('/mods', function(req, res, next) {
  res.render('./tutorials/mods');
});

router.get('/curseforge', function(req, res, next) {
  res.render('./tutorials/curseforge');
});

router.get('/map', function(req, res, next) {
  res.render('./tutorials/map');
});

router.get('/voicechat', function(req, res, next) {
  res.render('./tutorials/voicechat');
});

router.get("/mc/server/status", async function(req,res) {
  updateServerData()
  .then(response=>{
    res.status(200).send(response);
  })
  .catch(error=>{
    res.status(500).send(error);
  })
})


function updateServerData(){
  return new Promise((resolve, reject)=>{

    util.status('mc.gamerland.no')
    .then(response=>{
      if(response) {
        resolve(response);
      }
    })
    .catch(error=>{
      reject(error);
    })
  })
}


module.exports = router;
