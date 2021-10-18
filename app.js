const express = require("express");
const ejs = require('ejs');
const mongoose = require('mongoose');
const _ = require("lodash");

const app = express();

app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'))
mongoose.connect('mongodb://localhost:27017/todolistDB',{useNewUrlParser:true,useUnifiedTopology:true})

const itemSchema ={
    name: String,
}
const Item = mongoose.model( "Item",itemSchema)

const Item1 = new Item({
   name: 'Goal'
})
const Item2 = new Item({
   name: 'Identify any Intolerable problems '
})
const Item3 = new Item({
   name: 'Diagnose'
})
const Item4 = new Item({
   name: 'Design a plan '
})
const Item5 = new Item({
   name: 'Execute the plan '
})
const defaultItems = [Item1,Item2,Item3,Item4,Item5]

const listSchema= {
    name : String,
    items : [itemSchema]
}
const List = mongoose.model("List",listSchema)
app.get("/", (req,res) => {

    Item.find({},function (err,results) {
         if(results.length === 0){
             Item.insertMany(defaultItems,function (err) {
                 if(err){
                     console.log(err)
                    }else{
                        console.log('Successfully saved default items to todolistDB ');
                    }
                })
                res.redirect('/')
         }else{
              res.render('list',{listTitle:'Today', newListItems:  results });

         }
  })

});




app.post('/',(req,res)=>{
    const itemName = req.body.actionItem_inp;
let listName = req.body.list;   
if (listName) { listName = listName.trim();}

    let newItem = new Item({
        name:itemName
    })
    if(listName === 'Today'){
        newItem.save();
        res.redirect("/")
    }else{
        List.findOne({name:listName},function(err,foundList) {
            if(!err){
                foundList.items.push(newItem);
                foundList.save();
                res.redirect("/List/"+listName)
                }
        })
    }
    
})
app.get("/List/:customListName", (req,res)=>{
   const customListName =   _.capitalize(req.params.customListName)

   List.findOne({name:customListName},function (err,foundList) {
       if(!err){
           if(!foundList){
                const newList = new List({
                    name:customListName,
                    items:defaultItems
                })
               newList.save();
               res.redirect('/List/'+customListName)
           }else{
                res.render('list',{listTitle: foundList.name, newListItems:  foundList.items });

           }
       }
     })

})

app.post('/delete',(req,res)=>{
    const ItemCB_id = req.body.checkbox
    let listName = req.body.listName
    if (listName) { listName = listName.trim();}

    if (listName === 'Today'){
        Item.findByIdAndRemove( ItemCB_id ,function(err){
            if(!err){
                console.log(' successfuly removed an item');
                 res.redirect('/')           
                }
        });
    }else{
        List.findOneAndUpdate(
            // find one 
            {name:listName},
            // go deper and update it 
            {$pull:{items:{_id:ItemCB_id}}},
            (err,foundList)=> {
                if(!err){
                    res.redirect("/List/"+listName)
                }
        })
    }
     
    })

app.listen(3500, ()=>  {

    console.log("Server running on port 3500")
  })
