var array = [1,2,3,7,6,7,11,4,20,25,30];
var double = [];
const mapArr = array.map((element) => element *  2);
const filterArray = array.filter((num) =>  {
      return num === 7;
      
})
class Player {
   constructor(name, position){
      this.name = name;
      this.position = position
   }

   introduce(){
      console.log(`Hi, I am ${this.name} and I play ${this.position}`)
   }

}
class Wizard extends Player {
   constructor(name,position){
      super(name,position);
   }
   play(){
      console.log(`I am ${this.position}`)
   }
}
var joseph = new Wizard('Joseph','Forward');

