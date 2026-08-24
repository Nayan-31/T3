//debouncing delays the function execution until the user stops triggering the event for a particular event of time 

// import React, { useState } from 'react'

// function App() {
//     const[search , setSearch] = useState("")
    
//     function debounce(fn , delay){
//       let timer;
//       return function(...args){
//         clearTimeout(timer)
//         timer = setTimeout(()=>{
//             fn(...args)
//         }, delay)
//       }
//     }
   
//     function searchAPI(value){
//       console.log("API called" , value)
//     }
//     const debouncedSearch = debounce(searchAPI , 5000)

//     function handleChange(e){
//         let value = e.target.value
//         setSearch(value)
//         debouncedSearch(value)
//     }
//   return (
//     <>
//       <input
//        type = "text"
//        value={search}
//        onChange={handleChange}
//        placeholder='search'
//       /> 

//       <h2>Searching:{search}</h2>
//     </>
//   )
// }

// export default App
