
   import mongoose from "mongoose";
   const itemSchema = new mongoose.Schema({
      itemName : {type: String, lowercase:true, required: true},
      itemQuantity : Number,
      unitPrice : Number,
      totalPrice : Number,
      memo : String
   })
   const listSchema = new mongoose.Schema({
      listName : {type: String, required: true},
      itemArray : [itemSchema]
   })
   listSchema
   .virtual("url")
   .get(function (){
      return "/each-list/" + this._id
   })

   const ListCollection =  mongoose.model("test", listSchema);
  export function create(userInput){
      const newList = new ListCollection();
      newList.listName = userInput;
      newList.save()
      return newList;
  } 

 export function findList(id){
  return  ListCollection.findById(id)
  }

 export function findAndUpdateListName(id,updatedName){
   return  ListCollection.findByIdAndUpdate(id,{listName:updatedName},{new:true})
  }
export function findAndAddItem(id,name,quantity){
   findList(id)
   .then(result => {
      console.log(result);
      result.itemArray.push({itemName: name, itemQuantity:quantity});
      console.log(result.itemArray)
      
   })
   .then(()=> console.log("sucessfully add new item"))
   .catch(err => console.log(err))
}


