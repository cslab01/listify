
   import mongoose from "mongoose";
   const itemSchema = new mongoose.Schema({
      itemName : {type: String, lowercase:true},
      itemQuantity : {type:Number, min:0},
      unitPrice : {type:Number, min:0},
      totalPrice : {
         type : Number,
         get : function() {return this.itemQuantity * this.unitPrice}
      },
      note : String
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
  export async function create(userInput){
      const newList = new ListCollection();
      newList.listName = userInput;
      newList.save()
      return newList;
  } 

 export async function findList(id){
  return  ListCollection.findById(id)
  }

 export function findAndUpdateListName(id,updatedName){
    return  ListCollection.findByIdAndUpdate(id,{listName:updatedName},{new:true})
}

export async function findAndAddItem(id,name,quantity){
   const list = await findList(id)
   .then(list => {
      if(list.itemArray.length < 1){
         list.itemArray.push({itemName: name, itemQuantity:quantity});
         list.save(); //subdocs are only saved when you execute save() on parent docs
      }else{
         const foundItem = list.itemArray.find(item => item.itemName === name)
              if(foundItem == undefined){
                  list.itemArray.push({itemName: name, itemQuantity:quantity});
                  list.save(); //subdocs are only saved when you execute save() on parent docs
               }else{
                  foundItem.itemQuantity++;
                  list.save(); //subdocs are only saved when you execute save() on parent docs
               }  
         } 
      return list;
   })
   .catch(err => console.log(err))
   return list;
}


export async function updateItem(id,itemId, key, value){
   const list = await findList(id)
   const item = await list.itemArray.id(itemId);
   if(key === "itemQuantity" || key === "unitPrice"){
      item[key] = Number(value);
   }else{
      item[key] = value;
      console.log(value)
   }
   list.save();
   return item;
}



