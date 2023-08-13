import {db} from  "../firebase.config";
import {collection, addDoc} from 'firebase/firestore';



export const newDesign =  async(data)=>{
  await addDoc(collection(db , "Notes"), {
    data,
  });
}