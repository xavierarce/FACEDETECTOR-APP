import Express, { response }  from "express";
import bcrypt from "bcryptjs";
import cors from 'cors';
import knex from 'knex';

const dbSQL = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'postgres',
    password : 'test',
    database : 'smartbrain'
  }
});



const app = Express();

app.use(Express.json());
app.use(cors());


// app.get('/',(req,res)=>{
//   res.send(database.users)
// })

app.post('/signin',(req,res)=>{
  const {email, password} = req.body;
  if(!email || !password){
    return res.status(400).json('Incorrect form submission')
  }
  dbSQL.select('email','hash').from('login')
    .where('email','=', email)
    .then(data =>{
      const isValid = bcrypt.compareSync(password, data[0].hash); // true
      if(isValid){
        return dbSQL.select('*').from('users')
        .where('email','=', email)
        .then(user=>{
          res.json(user[0])
        })
        .catch(err => res.status(400).json('Unable to get user'))
      }
      res.status(404).json('wrong credentials')
    })
    .catch(err=> res.status(400).json('Wrong credentials'))
})

app.post('/register',(req,res)=>{
  const {email, name, password} = req.body;
  if(!email || !name || !password){
    return res.status(400).json('Incorrect form submission')
  }
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);
    dbSQL.transaction(trx=>{
      trx.insert({
        hash:hash,
        email:email
      })
      .into('login')
      .returning('email')
      .then(loginEmail=>{
        return trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0].email,
          name : name,
          joined: new Date()
        }).then(user =>{
          res.json(user[0]);
        })  
      })
      .then(trx.commit)
      .catch(trx.rollback) 
    })
    
    .catch(err=>res.status(404).json('Unable to register'))
})

app.get('/profile/:id',(req,res)=>{
  const {id}=req.params;
  dbSQL('*').from('users').where({id})
    .then(user=>{
      if(user.length){
        res.json(user[0]);
      }else{
      res.status(404).json('Not Found');
      }
    }).catch(err=> res.status(404).json('Error getting user'))
  }
)

app.put('/image',(req,res)=>{
  const {id} =req.body;
  dbSQL('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0].entries);
  })
  .catch(err=>res.status(400).json('Unable to get entries'))
})





app.listen(3000,()=>{
    console.log('Running')
})


/* 
! --> res= this is working
! signin  --> POST = success/fail
! register --> POST =  user
! profile/:userId --> GET = user
! image --> PUT --> user (count)
*/ 
