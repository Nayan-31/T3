// let score : number[] = [10 , 20 , 30]
// score.push(40)
// console.log(score)


//tuple

// let point : readonly [number , number , number] = [10 , 20 , 30]
// point.push(49)
// console.log(point)


// let point : [number , string] = [12 , "Nayan"]
// point.push(99)
// console.log(point)

//apan readonly tuple bhi bana sakte hai matlab usme aap push nii kar sakte bas

// const lockedPoint : readonly[number , number] = [28,22]

//____________________________________________________________________________________

// interface = mainly object ka contract/structure batane ke liye Jaise: is object ke andar name string hoga, age number hoga.

// interface User {
//     name : string ,
//     age : number ,
//     isAdmin? : boolean
// }

//type = type matlab kisi type ko ek naam de dena.

// type productId = string | number 
// let id1 : productId = 101
// let id2 : productId = "A-202"

// and 

// type User = {
//     name : string,
//     age : number
// }

// const user1:User = {
//     name : "Nayan",
//     age : 23
// }

//tumne bataya ki interface is a contract batane ke liye ki name string hoga , age number hoga but yaha toh tum Type me bhi contract bana rahe ho

//-----> object ke case mein type aur interface dono almost same kaam kar sakte hain. Toh contract sirf interface hi nahi banata. type bhi object ka contract/shape bana sakta hai.

//-----> Real difference ye hai: interface mainly object/class structure ke liye bana hai
//----->                         type zyada general hai — object ke alawa bhi kaafi cheezein define kar sakta hai

// type ID = string | number
// type Point = [number, number]
// type Status = "loading" | "success" | "error"


// 1) EXTEND existing object contracts cleanly
// interface Person {
//     name : string;
// }

// interface Admin extends Person {
//     role : "admin"
// }

// 2) DECLARATION MERGING (same name, combined shape)
// interface RequestMeta {
//     requestId : string
// }

// interface RequestMeta {
//     id : string
// }

// const meta : RequestMeta = {requestId : "abc" , id : "127:0.0.1"}


//                    and listen one more thing 

// interface tab use karo jab tum mainly object ka structure/contract define kar rahe ho, especially jab future me us structure ko extend/update karna ho.

// Example:

// interface User {
//   name: string
// }

// interface User {
//   age: number
// }

//TypeScript dono ko merge kar dega:
// const user: User = {
//   name: "Nayan",
//   age: 22
// }

//Isi ko bolte hain interface may evolve — matlab contract future me aur fields ke saath grow kar sakta hai.

//                       _____________________________________________________________

// type tab zyada useful hai jab object ke alawa kuch compose karna ho.

// Jaise union:
// type Status = "open" | "closed"

// jaise Tuple:
// type Point = [number, number]

// jaise Function signature:
// type Add = (a: number, b: number) => number

// jaise Mapped type:
//  type ReadonlyUser = {
//   readonly [K in keyof User]: User[K]
// }

// jaise Conditional type:
// type IsString<T> = T extends string ? true : false


//_____________________________________________________________________________

//Union type ka matlab hai variable multiple allowed types me se koi ek ho sakta hai.
//Union = multiple choices

// let id: string | number

// id = "abc"
// id = 123

// Yaha id: string ho sakta hai ya number isliye : string | number  , ko union type bolte hain.


//                       _____________________________

// Literal type ka matlab hai sirf exact fixed value allowed hogi.
// Literal = exact fixed choice

// let status: "open" | "closed"
// Ab : 
// status = "open"    // valid
// status = "closed"  // valid 

// lekin :
// status = "pending" // error

// Kyuki "pending" allowed hi nahi hai.

//___________________________________________________________________________

// Type narrowing ka matlab hai TypeScript pehle variable ko broad type maanta hai, phir tumhari if checks dekh kar uska type aur specific kar deta hai.
// broad type manta hai matlab : Broad type ka matlab hai aisa type jisme multiple possibilities allowed ho. Jaise: let value: string | number  Phir: if (typeof value === "string") {  is check ke baad TypeScript ke paas sirf ek possibility bachti hai: string , To broad se specific ho gaya.

// function printValue(value: string | number) {
//   if (typeof value === "string") {
//     console.log(value.toUpperCase())
//   } else {
//     console.log(value.toFixed(2))
//   }
// }

// Start me:value: string | number
// TypeScript ko nahi pata value string hai ya number.

// Phir ye check dekha: if (typeof value === "string")
// Ab is block ke andar TypeScript bolta hai:value = string

// Isliye ye allowed hai:value.toUpperCase()

// Aur else ke andar TypeScript samajh gaya ki string nahi hai, to bacha kya? ---> number
// Isliye: value.toFixed(2) , allowed hai. So:

// narrowing is TS reducing a broad union into a specific type after runtime checks

//_____________________________________________________________________________

// Function typing ka matlab hai function ke inputs aur output ke liye TypeScript ko pehle hi rule bata dena.

// example:
// function total(price: number, tax: number): number {
//   return price + tax
// }

// Yahan contract hai:
// price → number
// tax   → number
// return → number

//Matlab TypeScript bol raha hai: total() ko call karoge toh dono arguments number hone chahiye, aur function number return karega.
//Ab agar tum likho: total(499, 20) //sahi hai
//Lekin: total("499", undefined) // TypeScript editor mein pehle hi error dikha dega
//"red squiggle before you even save" ka matlab , VS Code mein "499" ya undefined ke neeche red underline aa jayegi

//______________________________________________________________________________

// Optional parameter ka matlab hai function call karte time us argument ko dena zaroori nahi hai.

// function greet(name: string, greeting?: string) {
//   console.log(`${greeting ?? "Hello"}, ${name}`);
// }

// Yahan: greeting?: string , matlab greeting optional hai. Tum call kar sakte ho: greet("Nayan") , Ab greeting ki value hogi: undefined , Isliye ye part: greeting ?? "Hello" , check karta hai: agar greeting null ya undefined hai, to "Hello" use karo. To output: Hello, Nayan , Aur agar: greet("Nayan", "Hi") , to greeting = "Hi" hai, isliye: Hi, Nayan



// function greet2(name: string, greeting: string = "Hello") {
//   console.log(`${greeting}, ${name}`);
// }

// Yahan: greeting: string = "Hello" , matlab greeting ka default value already "Hello" set hai. Agar: greet2("Nayan")
// to JavaScript automatically: greeting = "Hello" kar dega. Output: Hello, Nayan
// Aur: greet2("Nayan", "Hey") , to default replace ho jayega: Hey, Nayan , Bas difference yaad rakho: greeting?: string , means: value nahi di to undefined rahegi, tumhe andar handle karna padega. While: greeting: string = "Hello"
// means: value nahi di to "Hello" automatically fill ho jayega. Isliye first function mein ye extra logic chahiye: greeting ?? "Hello"


//_________________________________________________________________________________

// any aur unknown dono mein tum kisi bhi type ki value store kar sakte ho. 
// both can hold any value, but any disables checks while unknown requires proof before use

// let a: any
// let b: unknown

// a = "hello"
// a = 123
// a = true

// b = "hello"
// b = 123
// b = true

// any TypeScript ke checks almost band kar deta hai.

// let value: any = "hello"

// value.toUpperCase()
// value.toFixed()
// value.xyz()

//TypeScript zyada complain nahi karega. Problem ye hai ki: value.toFixed() , string pe runtime error de sakta hai. Matlab any bolta hai: "Jo karna hai karo, main check nahi karunga."


//unknown bhi kuch bhi hold kar sakta hai, lekin use karne se pehle TypeScript bolta hai: "Pehle prove karo ki actual type kya hai"

// Example:
// let value: unknown = "hello"
// value.toUpperCase() // ❌ error

//TypeScript bolega: mujhe kaise pata ye string hai?
//Pehle check karo:
// if (typeof value === "string") {
//   value.toUpperCase() // ✅
// }

//Ab TypeScript ko proof mil gaya ki value string hai. Isi ko narrowing bhi bolte hain.

//____________________________________________________________________________

//enum vs literal union 

//Socho tumhare paas sirf 2 status allowed hain:
// "open"
// "closed"

// Literal union
// type Status = "open" | "closed"

// Iska matlab bas itna hai: Status naam ka type hai jisme sirf "open" ya "closed" allowed hai.
// Use: let s: Status = "open"
// Ye sirf TypeScript ka rule hai.
// Jab code JavaScript me convert hoga, ye line: type Status = "open" | "closed" gayab ho jayegi


// Enum

// enum Status {
//   Open = "open",
//   Closed = "closed"
// }

// Ab Status sirf type nahi hai, ek actual cheez bhi ban gaya. Tum likh sakte ho: console.log(Status.Open)
// Output: open

// Matlab runtime par bhi Status available hai.
// Bas difference: type Status = "open" | "closed" sirf rule hai.
// enum Status { ... } rule + actual runtime object hai.

// TypeScript ke saare types JavaScript me code generate nahi karte.
// example 
// let age: number = 22
// compile hone ke baad JavaScript me type information remove ho jaati hai: let age = 22

// Lekin enum special hai.
//  enum Status {
//   Open = "open",
//   Closed = "closed"
// }

// Iska JavaScript me actual code generate hota hai, kyunki runtime par tum ye kar sakte ho: console.log(Status.Open)

//___________________________________________________________________________________________

// keyof T ka matlab hota hai type T ke saare property names ka union.
// example :
//   type User = {
//   name: string
//   age: number
// }

// Ab:  type UserKeys = keyof User
// UserKeys ban jayega: "name" | "age"
// Matlab keyof User ne object ke keys nikaal diye.

// Ab typeof v type position mein ka matlab hai: kisi existing variable/value ka type structure nikaal lo.
// example :
// const user = {
//   name: "Nayan",
//   age: 22
// }

// ab : type UserType = typeof user
// UserType roughly ye ban jayega:
// {
//   name: string
//   age: number
// }

// To short mein:
// keyof T = type ke keys nikaalo
// typeof v = value ka type nikaalo


//___________________________________________________________________________________

