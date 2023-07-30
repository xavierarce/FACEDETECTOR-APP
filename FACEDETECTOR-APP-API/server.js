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

dbSQL.select('*').from('users').then(data=>{
  console.log(data)
});

const app = Express();

app.use(Express.json());
app.use(cors());

const database = {
  users:[
    {
      id:'123',
      name : 'John',
      password:'cookies',
      email: 'john@gmail.com',
      entries: 0,
      joined: new Date()
    },
    {
      id:'124',
      name : 'Sally',
      password:'bananas',
      email: 'sally@gmail.com',
      entries: 0,
      joined: new Date()
    }
  ]
}

app.get('/',(req,res)=>{
  res.send(database.users)
})

app.post('/signin',(req,res)=>{
  //*   // Load hash from your password DB.
  //* bcrypt.compare("cookies", '$2a$10$wfb8gN0bIZie1pBE/cjE9OSrbK7tCuDuSHGgru/yiua7InbF3aHlu', function(err, res) {
  //*   // res === true
  //*   console.log('first guess', res)
  //* });
  //* bcrypt.compare("not_bacon", '$2a$10$wfb8gN0bIZie1pBE/cjE9OSrbK7tCuDuSHGgru/yiua7InbF3aHlu', function(err, res) {
  //*   console.log('second guess', res)
  //*   // res === false
  //* });
  if(req.body.email=== database.users[0].email &&
    req.body.password === database.users[0].password){
      res.json(database.users[0]);
    }else{
      alert(Error);
      res.status(404).json('error logging in')
    }
})

app.post('/register',(req,res)=>{
  const {email, name, password} = req.body;
  //* bcrypt.genSalt(10, function(err, salt) {
  //*   bcrypt.hash(password, salt, function(err, hash) {
  //*     console.log(hash)
  //*   });
  //* });
  dbSQL('users')
    .returning('*')
    .insert({
      email: email,
      name : name,
      joined: new Date()
    }).then(user =>{
      res.json(user[0]);
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





// // As of bcryptjs 2.4.0, compare returns a promise if callback is omitted:
// bcrypt.compare("B4c0/\/", hash).then((res) => {
//   // res === true
// });


app.listen(3000,()=>{
    console.log('runnin')
})


/* 
! --> res= this is working
! signin  --> POST = success/fail
! register --> POST =  user
! profile/:userId --> GET = user
! image --> PUT --> user (count)
*/ 
