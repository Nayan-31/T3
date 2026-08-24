// function debounce(fn , delay){
//   let timer;

//   return function(...args){
//     clearTimeout(timer)

//     timer = setTimeout(()=>{
//         fn(...args)
//     }, delay)
//   }
// }

// function search(value){
//     console.log("API CALL :" , value)
// }

// const debounceSearch = debounce(search , 500)

// debounceSearch("h")
// debounceSearch("he")
// debounceSearch("hel")
// debounceSearch("hello")

//__________________________________________________

// function throttle(fn , delay){
//   let canRun = true

//   return function(...args){
//     if(!canRun) return

//     fn(...args)

//     canRun = false

//     setTimeout(()=>{
//       canRun = true
//     },delay)
//   }
// }

// function handleScroll(){
//     console.log("Scroll event")
// }

// const throttledScroll = throttle(handleScroll ,  1000)

// window.addEventListener("scroll" , throttledScroll)


//_________________________________________________________

//closure

// function outer(){
//   let count = 0

//   function inner(){
//     count++
//     console.log(count)
//   }

//   return inner
// }

// const counter = outer();

// counter()
// counter()
// counter()

//_________________________________________________

// function greet(name){
//     return `hello ${name}`
// }

// function processUser(fn , name){
//     return fn(name)
// }

// console.log(processUser(greet , "Rahul"))

//__________________________________________________

for(var i = 0 ; i < 3 ; i++){
  ((value)=>{
    setTimeout(()=>{
      console.log(value)
    },1000)
  })(i)
}

//______________________________________________
// function hello(n) {
//   if(n === 0){
//     return
//   }
//   console.log("hello")
//   return hello(n-1)
// }
// let n = 5
// hello(n);