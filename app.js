const express = require("express");
const ejs = require('ejs');
const { getDate } = require("./date");
const date = require(__dirname+'/date.js')

let newActionItems = []
let workItems = []
const app = express();

app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'))
app.get("/", (req,res) => {
    let day = getDate()
    res.render('list',{listTitle:day, items: newActionItems });

});

app.get('/work', (req,res)=>{
    res.render('list',{listTitle:'Work list', items: workItems})
})
app.post('/',(req,res)=>{
    let newItem = req.body.actionItem_inp;
    if(req.body.list === 'work'){
         workItems.push(newItem);
         res.redirect('/work');
    }else{
        newActionItems.push(newItem);
        res.redirect('/')

    }

})
app.get('/about',(req,res)=>{
    res.render('about')
})
app.listen(3500, ()=>  {

    console.log("Server running on port 3500")
  })
