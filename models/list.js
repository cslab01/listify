
import mongoose from "mongoose";
const itemSchema = new mongoose.Schema({
   itemName: { type: String, lowercase: true },
   itemQuantity: { type: Number, min: 0 },
   unitPrice: { type: Number, min: 0 },
   totalPrice: {
      type: Number,
      get: function () { return this.itemQuantity * this.unitPrice }
   },
   note: String,
   checked: { type: Boolean, default: false }
})
const listSchema = new mongoose.Schema({
   listName: String,
   itemArray: [itemSchema]
})
listSchema
   .virtual("url")
   .get(function () {
      return "/each-list/" + this._id
   })

listSchema
   .virtual("sumToBuy")
   .get(function () {
      return this.itemArray.reduce((acc, curr) => acc + curr.totalPrice, 0)
   })

listSchema
   .virtual("sumPurchased")
   .get(function () {
      const purchasedArr = this.itemArray.filter(item => item.checked == true);
      return purchasedArr.reduce((acc, curr) => acc + curr.totalPrice, 0)
   })

const ListCollection = mongoose.model("test", listSchema);

export async function create(userInput) {
   const newList = new ListCollection({listName: userInput});
   await newList.save()
   return newList;
}

export async function findList(id) {
   return ListCollection.findById(id)
}

export function findAndUpdateListName(id, updatedName) {
   return ListCollection.findByIdAndUpdate(id, { listName: updatedName }, { new: true })
}

export async function findAndAddItem(id, name, quantity, price) {
   const list = await findList(id)
      .then(list => {
         if (list.itemArray.length < 1) {
            list.itemArray.push({ itemName: name, itemQuantity: quantity, unitPrice: price });
            list.save(); //subdocs are only saved when you execute save() on parent docs
         } else {
            const foundItem = list.itemArray.find(item => item.itemName === name)
            if (foundItem == undefined) {
               list.itemArray.push({ itemName: name, itemQuantity: quantity, unitPrice: price });
               list.save(); //subdocs are only saved when you execute save() on parent docs
            } else {
               foundItem.itemQuantity++;
               list.save(); //subdocs are only saved when you execute save() on parent docs
            }
         }
         return list.itemArray[list.itemArray.length - 1];
      })
      .catch(err => console.log(err))
   return list;
}


export async function updateItem(id, itemId, key, value) {
   const list = await findList(id)
   const item = await list.itemArray.id(itemId);
   if (key === "itemQuantity" || key === "unitPrice") {
      item[key] = Number(value);
   } else {
      item[key] = value;

   }
   await list.save();
   return [item, list.sumToBuy, list.sumPurchased];
}

export async function deleteItem(id, itemId) {
   const list = await findList(id);
   const item = await list.itemArray.id(itemId);
   await item.remove();
   await list.save();
   return list

}
/* all lists page */
export async function findAllLists(){
   return ListCollection.find();
}

export async function findAndDeleteList(id){
    await ListCollection.findByIdAndDelete(id)
    .then(result => result)
    .catch(err => console.log(err))
}

export async function duplicate(id){
   const list = await findList(id);
   const duplicateList = new ListCollection(list);
   duplicateList.set({
      _id : new mongoose.Types.ObjectId(),
      listName: list.listName + " copy"

   })
   duplicateList.isNew = true;
   await duplicateList.save();
}
 

