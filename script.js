// let n=5

// for (let i = 1; i <= n; i++) {

//     for (let j = 1; j <= n - i; j++) {
//         process.stdout.write(" ");
//     }

//     for (let j = 1; j <= 2 * i - 1; j++) {
//         process.stdout.write("*");
//     }

//     console.log();
// }

// for (let i = n - 1; i >= 1; i--) {

//     for (let j = 1; j <= n - i; j++) {
//         process.stdout.write(" ");
//     }

//     for (let j = 1; j <= 2 * i - 1; j++) {
//         process.stdout.write("*");
//     }

//     console.log();
// }



// let n=5

// for (let i = 1; i <= n*2-1; i++) {
//    if(i <= 5 ){
//     for( j = 1 ; j <= i ; j++){
//         process.stdout.write("* ")
//     }
//    }else{
//     for( j = n-1 ; j >= i-n ; j--){
//         process.stdout.write("* ")
//     }
//    }
//    console.log()
// }


// let n = 5 ;

// for(let i = 1 ; i <= n ; i++){
//    //numbers
//    for(let j = 1 ; j <= i ; j++){
//      process.stdout.write(j.toString())
//    }
//    //spaces
//    for(let j = 1 ; j <= 2 * (n-i) ; j++){
//     process.stdout.write(" ")
//    }
//    //numbers
//    for(let j = i ; j >= 1;j--){
//     process.stdout.write(j.toString())
//    }

//    console.log()
// }


// let n = 5 ;
// let point = 1;
// for(let i = 1 ; i <= n ; i++){
//   for(let j = 1 ; j <= i ; j++){
//    process.stdout.write(point + " ")
//    point++
//   }
//   console.log()
// }


// let n = 5 ;
// for(let i = 1 ; i <= n ; i++){
//   for(let j = 1 ; j <= i ; j++){
//     process.stdout.write(String.fromCharCode(64 + j))
//   }
//   console.log()
// }

// let n = 5 ;
// for(let i = n ; i >= 1 ; i--){
//   for(let j = 1 ; j <= i ; j++){
//     process.stdout.write(String.fromCharCode(64 + j))
//   }
//    console.log()
// }

// let n = 5 ;
// for(let i = 1 ; i <= n ; i++){
//   for(let j = 1 ; j <= i ; j++){
//     process.stdout.write(String.fromCharCode(64 + i))
//   }
//   console.log()
// }

// let n = 5 ;

// for(let i = 0 ; i < n ; i++){
//   //spaces 
//   for(let j = 0 ; j < n - i - 1 ; j++){
//     process.stdout.write(" ")
//   }

//   //characters
//   for(let j = 0 ; j < 2 * i + 1 ; j++){
//     process.stdout.write(String.fromCharCode(65 + j))
//   }

//   // //spaces 
//   // for(let j = 0 ; j < n - i - 1 ; j++){
//   //   process.stdout.write(" ")
//   // }
//   console.log()
// }


// let n = 5 ;

// for(let i = 1 ; i <= n ; i++){
//    //spaces
//    for(let j = 1 ; j <= 2 * (n-i) ; j++){
//     process.stdout.write(" ")
//    }
//    //numbers
//    for(let j = 1 ; j <= i ; j++){
//      process.stdout.write(String.fromCharCode(64 + j))
//    }
//    //numbers
//    for(let j = i-1 ; j >= 1;j--){
//     process.stdout.write(String.fromCharCode(64 + j))
//    }

//    console.log()
// }

//18 is in due

// let n = 4 ;
// let init = 0;
// for(let i = 0 ; i < n ; i++){
//   //stars
//   for(let j = 0 ; j < n-i ; j++){
//     process.stdout.write("*")
//   }
//   //spaces
//   for(let j = 0 ; j < init ; j++){
//     process.stdout.write(" ")
//   }
//   //stars
//   for(let j = 0 ; j < n-i ; j++){
//     process.stdout.write("*")
//   }
//   console.log();
//   init += 2 ;
// }

// init = 2 * n - 2;
// for(let i = 0; i < n; i++){

//     // left stars
//     for(let j = 0; j <= i; j++){
//         process.stdout.write("*");
//     }

//     // spaces
//     for(let j = 0; j < init; j++){
//         process.stdout.write(" ");
//     }

//     // right stars
//     for(let j = 0; j <= i; j++){
//         process.stdout.write("*");
//     }

//     console.log();

//     init -= 2;
// }



// let n = 4;

// for (let i = 0; i < n; i++) {

//     for (let j = 0; j < n; j++) {

//         if (i == 0 || i == n - 1 || j == 0 || j == n - 1) {
//             process.stdout.write("*");
//         } else {
//             process.stdout.write(" ");
//         }

//     }

//     console.log();
// }

// let n = 4;
// let spaces = 2 * n - 2
// for(let i = 0 ; i < n ; i++){
//   //left star
//   for(let j = 0 ; j <= i ; j++){
//      process.stdout.write("*");
//   }
//   //space
//   for(let j = 0 ; j < spaces ; j++){
//     process.stdout.write(" ")
//   }
//   //left star
//   for(let j = 0 ; j <= i ; j++){
//      process.stdout.write("*");
//   }
//   console.log()
//   spaces -= 2
// }
// spaces = 0;
// for(let i = 0; i < n; i++){

//     for(let j = 0; j < n - i; j++){
//         process.stdout.write("*");
//     }

//     for(let j = 0; j < spaces; j++){
//         process.stdout.write(" ");
//     }

//     for(let j = 0; j < n - i; j++){
//         process.stdout.write("*");
//     }

//     console.log();
//     spaces += 2;
// }

//_____________________________________________________________________________________________________________________________________

// let n = 12345

// let count = 0 
// while( n > 0){
//     let lastDigit = n % 10 ; //5 , 4 , 3 , 2 , 1
//     count = count + 1 ;
//     n = Math.floor(n/10)
// }
// console.log(count)
// _________________________________

// let n = 12345;

// let rev = 0 ;

// while(n > 0){
//    let lastDigit = n % 10 ;

//    n = Math.floor(n / 10)

//    rev = rev * 10 + lastDigit
// }

// console.log(rev)

// ___________________________________

// let n = 4554;
// let originalNumber = n
// let rev = 0 ;

// while(n > 0){
//    let lastDigit = n % 10 ;
//    rev = rev * 10 + lastDigit
//    n = Math.floor(n / 10)
// }
// if(rev === originalNumber){
//      console.log("it's palindrome")
//    }else {
//     console.log("Not a palindrome");
// }

// ___________________________________

// let n = 153
// let sum = 0 ;
// let duplicates = n

// while(n > 0){
//     let lastdigit = n % 10 ;
//     sum = sum + (lastdigit ** 3)
//     n = Math.floor(n/10)
// }

// if(sum === duplicates){
//    console.log("it's an armstrong number")
// }

//__________________________________________

// let n = 36

// for(let i = 1 ; i <= n ; i++){
//     if(n % i === 0){
//         console.log(i , " ")
//     }
// }

//_____________________________________________

// let a = 9, b = 12

// while(a > 0 && b > 0){
//     if(a > b) a = a % b;
//     else b = b % a
// }

// if (a == 0) {
//     console.log(b);
// } else {
//     console.log(a);
// }

// ______________________________________________

// const name = function(i , n){
//    if(i > n){
//     return;
//    }
//    console.log("nayan")
//    name(i+1 , n)
// }

// name(1 , 5)

//______________________________________________

// const print = function(i , n){
//     if(i > n){
//         return;
//     }
//     console.log(i)
//     print(i+1 , n)
// }

// print(1 , 5)

//______________________________________________

// const print = function(n){
//    if(n == 0){
//     return
//    }
//    console.log(n)
//    print(n-1)
// }

// print(5)

//______________________________________________

//sum of 1st n numbers if n = 5 ; 1 + 2 + 3 + 4 + 5

// const sum = function(n){
//    let finalSum = n*(Math.floor(n+1)/2)
//    console.log(finalSum)
// }

// sum(3)

//______________________________________________

//factorial of a given number

// const factorialNumber = function(n){
//    if(n === 0 || n === 1){
//     return 1 ;
//    }
//    return n * factorialNumber(n - 1)
// }

// console.log(factorialNumber(5))

//______________________________________________

//reverse an array 

// let arr = [1 , 2 , 3, 4 , 5]
// const reverse = function(arr , left , right){
//  if(left >= right){
//     return 
//  }

//  let temp = arr[left]
//  arr[left] = arr[right]
//  arr[right] = temp

//  reverse(arr , left+1 , right-1)
// }

// reverse(arr , 0 , arr.length - 1)

// console.log(arr)

//__________________________________________________

// let palindromeInt = function(name){
//   let left = 0 ;
//   let right = name.length - 1;

//   while(left < right){
//     if(name[left] !== name[right]){
//         return false
//     }

//     left++
//     right--
//   }
//   return true
// }

// console.log(palindromeInt("NAYAN"))

//___________________________________________________

// let arr = [10 , 1 , 2 , 3 , 25 , 10 , 1]
// let map = new Map()

// for(let i = 0 ; i < arr.length ; i++){
//     if(map.has(arr[i])){
//         map.set(arr[i] , map.get(arr[i])+1)
//     }else{
//         map.set(arr[i],1)
//     }
// }
// console.log(map)

//___________________________________________________

// let arr = [10  , 2 , 10 , 5 , 3 ,3 ,1]
// let map = new Map()

// for(let i = 0 ; i < arr.length ; i++){
//     if(map.has(arr[i])){
//         map.set(arr[i] , map.get(arr[i])+1)
//     }else{
//         map.set(arr[i],1)
//     }
// }

// let highest = 0; //kitni baar aaya hai 
// let lowest = arr.length;
// let highestElement ; //kon sa element jada aaya hai
// let lowestElement;

//     for(let [key , values] of map){
//         if(values > highest){
//             highest = values
//             highestElement = key
//         }
//     }

//     for(let [key , values] of map){
//         if(values < lowest){
//             lowest = values
//             lowestElement = key
//         }
//     }

// console.log(highestElement , highest)
// console.log(lowestElement , lowest)

//___________________________________________________

// let selectionSort = function(arr){
//    for(let i= 0 ; i <= arr.length - 2 ; i++){
//     let minIndex = i
//      for(let j = i+1 ; j<= arr.length-1 ; j++){
//        if(arr[j] < arr[minIndex]){
//         minIndex = j
//        }
//      }
//    let temp = arr[minIndex]
//    arr[minIndex] = arr[i]
//    arr[i] = temp
//    }

//    return arr
// }

// let n = [13,46,24,52,20,9]
// console.log(selectionSort(n))

// ___________________________________________________

// let BubbleSort = function(arr){
//    for(let i= 0 ; i < arr.length - 1 ; i++){
//      for(let j = 0 ; j< arr.length - 1 - i ; j++){
//        if(arr[j] > arr[j + 1]){
//         let temp = arr[j]
//         arr[j]  = arr[j+1]
//         arr[j+1]  = temp
//        }
//      }
//    }

//    return arr
// }

// let n = [13,46,24,52,20,9]
// console.log(BubbleSort(n))

//___________________________________________________
//insertion sort 

// let arr = [13, 46, 24, 52, 20, 9];

// for (let i = 1; i < arr.length; i++) {
//     let current = arr[i];
//     let j = i - 1;

//     while (j >= 0 && arr[j] > current) {
//         arr[j + 1] = arr[j];
//         j--;
//     }

//     arr[j + 1] = current;
// }

// console.log(arr);

//____________________________________________________

//merge sort 

// let merge = function(arr , low , mid , high){
//     let temp = []
//     let left = low ;
//     let right = mid + 1 ;

//     while(left <= mid && right <= high ){
//         if(arr[left] <= arr[right]){ //wo jo 1st half and 2nd half compare hoga agar left chota hua then add it to temp
//             temp.push(arr[left])
//             left++
//         }else{
//             temp.push(arr[right])
//             right++
//         }
//     }

//     while(left <= mid){
//         temp.push(arr[left])
//         left++
//     }
//     while(right <= high){
//         temp.push(arr[right])
//         right++
//     }

//     for(i = low ; i <= high ; i++){
//         arr[i] = temp[i - low]
//     }
// }

// function mergeSort(arr, low, high) {

//     if (low >= high) {
//         return;
//     }

//     let mid = Math.floor((low + high) / 2);

//     mergeSort(arr, low, mid);
//     mergeSort(arr, mid + 1, high);

//     merge(arr, low, mid, high);
// }

// let arr = [13, 46, 24, 52, 20, 9];

// mergeSort(arr, 0, arr.length - 1);

// console.log(arr);

//____________________________________________________

//recursive bubble sort

// function bubbleSort(arr , n){
//     if(n === 1)return 

//     for(let i = 0 ; i < n - 1 ; i++){
//        if(arr[i] > arr[i + 1]){
//          let temp = arr[i]
//          arr[i] = arr[i+1]
//          arr[i+1] = temp
//        }
//     }

//     bubbleSort(arr , n - 1) //52 apni correct position (last) par pahunch gaya , Ab hume 52 ko dobara compare karne ki zarurat nahi hai.
// }

// let arr = [13, 46, 24, 52, 20, 9];
// bubbleSort(arr , arr.length)
// console.log(arr)

//______________________________________________________

// function findPivotIndex(arr, first, last) {
//     let pivot = arr[first]
//     let i = first + 1, j = last
//     while (i <= j) {
//         while (i <= last && arr[i] <= pivot) i++;
//         while (j >= first && arr[j] >= pivot) j--

//         if (i < j) {
//             swap(arr, i, j)
//         }
//     }
//     swap(arr, j, first)
//     return j
// }

// function quickSort(arr, first, last) {
//     if (first >= last) return
//     let pvtIdx = findPivotIndex(arr, first, last)
//     quickSort(arr, first, pvtIdx - 1)
//     quickSort(arr, pvtIdx + 1, last)
// }

// function swap(arr, i, j) {
//     let temp = arr[i]
//     arr[i] = arr[j]
//     arr[j] = temp
// }

// let arr = [13, 46, 24, 52, 20, 9]
// quickSort(arr, 0, arr.length - 1)
// console.log(arr)

//_______________________________________________________

//check if the Array is sorted II

// function SortedArray(arr, n) {
//     for (let i = 0; i <= n - 1; i++) {
//         for (let j = i + 1; j <= n - 2; j++) {
//             if (arr[i] > arr[j]) return false
//         }
//     }
//     return true
// }

// let arr = [1, 2, 3, 4, 5, 6]
// console.log(SortedArray(arr, arr.length))

//________________________________________________________

//remove duplicates from sorted array

// function removeDuplicates(nums) {
//     let set = new Set()

//     let index = 0

//     for (let num of nums) {
//         if (!set.has(num)) {
//             set.add(num)
//             nums[index] = num
//             index++
//         }
//     }

//     return index
// }

// let nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]
// console.log(removeDuplicates(nums))
// console.log(nums)

//________________________________________________________

//array left rotation by 1 

// let arr = [1, 2, 3, 4, 5]
// let temp = arr[0]
// for (let i = 0; i < arr.length - 1; i++) {
//     arr[i] = arr[i + 1]
// }
// arr[arr.length - 1] = temp
// console.log(arr)

//________________________________________________________

// array left rotation by k elements 
// let arr = [1, 2, 3, 4, 5]
// let k = 3
// k = k % arr.length
// for (let j = 1; j <= k; j++) {
//     let temp = arr[0]
//     for (let i = 0; i < arr.length - 1; i++) {
//         arr[i] = arr[i + 1]
//     }
//     arr[arr.length - 1] = temp
// }
// console.log(arr)

//________________________________________________________

//move zeroes to end

// function moveZeroes(arr) {
//     let temp = new Array(arr.length).fill(0)

//     let index = 0

//     for (let i = 0; i < arr.length; i++) {
//         if (arr[i] != 0) {
//             temp[index] = arr[i]
//             index++
//         }
//     }
//     for (let i = 0; i < arr.length; i++) {
//         arr[i] = temp[i]
//     }
//     return arr
// }

// let arr = [0, 1, 0, 3, 12]
// console.log(moveZeroes(arr))

//________________________________________________________

// function findUnion(arr1, arr2, m, n) {
//     let freq = new Map();

//     for (let i = 0; i < m; i++) {
//         freq.set(arr1[i], (freq.get(arr1[i]) || 0) + 1);
//     }

//     for (let i = 0; i < n; i++) {
//         freq.set(arr2[i], (freq.get(arr2[i]) || 0) + 1);
//     }

//     let union = Array.from(freq.keys()).sort((a, b) => a - b);

//     return union;
// }

// let arr1 = [1, 2, 2, 3, 4, 4, 5];
// let arr2 = [2, 3, 3, 4, 5, 6];

// console.log(findUnion(arr1, arr2, arr1.length, arr2.length));

//or using set

// function findUnion(arr1, arr2, m, n) {
//     let set = new Set()

//     for (let i = 0; i < m; i++) {
//         set.add(arr1[i])
//     }
//     for (let i = 0; i < n; i++) {
//         set.add(arr2[i])
//     }
//     let union = Array.from(set)
//     return union
// }

// let arr1 = [1, 2, 2, 3, 4, 4, 5];
// let arr2 = [2, 3, 3, 4, 5, 6];
// console.log(findUnion(arr1, arr2, arr1.length, arr2.length))

//or two pointers ye optimal hai abhi nii kar raha hu 

//______________________________________________________

// function MissingNumber(arr) {
//     let n = arr.length + 1
//     for (let i = 1; i <= n; i++) {
//         let found = false
//         for (let j = 0; j < n - 1; j++) {
//             if (arr[j] === i) {
//                 found = true
//                 break
//             }
//         }
//         if (!found) {
//             return i
//         }
//     }
//     return -1
// }

// const arr = [8, 2, 4, 5, 3, 7, 1];
// console.log(MissingNumber(arr));

//________________________________________________________

// function findMaxConsecutiveOnes(nums){
//     let count = 0 ;
//     let maxI = 0;

//     for(let i = 0 ; i < nums.length ; i++){
//         if(nums[i] === 1){
//             count++
//         }else{
//             count = 0 
//         }
//         maxI = Math.max(maxI , count)
//     }
//     return maxI
// }

// let nums = [1, 0, 1, 1, 0, 1];
// console.log(findMaxConsecutiveOnes(nums))

//___________________________________________________________
//number should appear once 

// function findAppearOnce(nums){
//   let map = new Map()
//   for(let i = 0 ; i < nums.length ; i++){
//     map.set(nums[i] , (map.get(nums[i]) || 0) + 1)
//   }
//     for(let [key , value] of map){
//         if(value === 1) {
//             return key
//         }
//     }
// }

// let nums = [4, 1, 2, 1, 2];
// console.log(findAppearOnce(nums));

//___________________________________________________________

//longest subarray 

// function longestSubarray(arr , k){
//  let left = 0 ;
//  let right = 0 ; //left & right same indices pe rahenge arr[0] pe and jaise jaise requirement hogi waise waise karna
//  let sum = arr[0]
//  let maxLen = 0

//  while(right < arr.length){
    
//     while(left <= right && sum > k){
//         sum -= arr[left]
//         left++
//     }

//     if(sum === k){
//         maxLen = Math.max(maxLen , right - left + 1  ) //4 - 3 + 1 = 2 
//     }

//     right++

//     if(right < arr.length){
//         sum += arr[right]
//     }
//  }
//  return maxLen
// }

// let arr = [10 , 2 , 3 , 5 ,1 , 9]
// let k = 10

// console.log(longestSubarray(arr , k))

//_________________________________________________________

//print name

// function printName(name , count , N){
//    if(count === N) return

//    console.log(name)

//    printName(name , count + 1 , N)
// }

// let name = "Nayan"
// let N = 5 
// let count = 0

// printName(name , 0 , N)

//_________________________________________________________

// print 1 to N using Resursion

// function PrintN(current , n){
//     if(current > n) return

//     console.log(current)

//     PrintN(current + 1 , n)
// }

// let n = 10
// PrintN(1 , n)

//_________________________________________________________

//print N to 1 using Recursion

// function PrintReverse(n){
//    if( n === 0){
//     return
//    }

//    console.log(n)
    
//    PrintReverse(n - 1)
// }

// let n = 10 
// PrintReverse(n)

//________________________________________________________

//factorial of an given array 

//iterative method 

// function factorial(n){
//     let ans = 1
//     for(let i = 1 ; i <= n ; i++){
//     ans *= i
//     }
//     return ans
// }

// let n = 3
// console.log(factorial(n))

//recruitive method

// function factorial(n){
//    if(n === 0){
//     return 1
//    }

//    return n * factorial(n - 1)
// }

// let n = 3
// console.log(factorial(n))

//_______________________________________

//Reverse an array 

// function reverseArr(arr){
//     let n = arr.length
//    let ans = new Array(n)
//     for(let i = 0 ; i < n ; i++){
//         ans[i] = arr[n - 1 - i]
//     }
//     return ans
// }

// let arr = [1,2,3,4,5]
// console.log(reverseArr(arr))


// function reverseArr(arr){
//   let i = 0 ;
//   let j = arr.length - 1 
//   while(i < j){
//     let temp = arr[i]
//     arr[i] = arr[j]
//     arr[j] = temp

//     i++
//     j--
//   }
//   return arr
// }

// let arr = [1,2,3,4,5,6]
// console.log(reverseArr(arr))


//_________________________________________

//two sum 

// function TwoSum(arr , target){
//     let n = arr.length 

//     for(let i = 0 ; i < n - 1 ; i++){
//         for(let j = i + 1 ; j < n ; j++){
//             if(arr[i] + arr[j] === target){
//                 return "YES"
//             }
//         }
//     }
//     return "NO";
// }

// function TwoSumIndices(arr , target){
//     let n = arr.length 
//  for(let i = 0 ; i < n-1 ; i++){
//     for(let j = i + 1 ; j < n ; j++ ){
//         if(arr[i] + arr[j] === target){
//             return [i , j]
//         }
//     }
//  }
//  return [-1 , -1]
// }

// let arr = [2, 6, 5, 8, 11]
// let target = 14
// console.log(TwoSum(arr , target))
// console.log(TwoSumIndices(arr , target))

  //or 

// let arr = [2, 6, 5, 8, 11]
// let target = 14

// function TwoSum(arr , target){
//     let map = new Map()
//     for(let i = 0 ; i < arr.length ; i++){
//         let result = target - arr[i]
//         if(map.has(result)){
//             return "YES"
//         }
//         map.set(arr[i] , i)
//     }
//     return "NO"
// }

// function TwoSumIndices(arr , target){
//     let map = new Map()
//     for(let i = 0 ; i < arr.length ; i++){
//         let result = target - arr[i]
//         if(map.has(result)){
//            return [map.get(result) ,i]
//         }
//         map.set(arr[i] , i)
//     }
//     return [-1 , -1]
// }

// console.log(TwoSum(arr , target))
// console.log(TwoSumIndices(arr , target))

//______________________________________________________

//sort an array of 0s , 1s , 2s

// function sortArr(arr){
//     let low = 0 ;
//     let mid = 0 ;
//     let high = arr.length - 1

//     while(mid <= high){

//         if(arr[mid] === 0){
//             let temp = arr[low]
//             arr[low] = arr[mid]
//             arr[mid] = temp

//             low++
//             mid++

//         }else if(arr[mid] === 1){
//             mid++
//         }else{
//             let temp = arr[mid]
//             arr[mid] = arr[high]
//             arr[high] = temp

//             high--
//         }
//     }
//     return arr
// }

// let arr = [2 , 0 , 2 ,1 ,1 ,0]
// console.log(sortArr(arr))


//______________________________________________________

// function majorityElement(nums){
//   let n = nums.length
  
//   for(let i = 0 ; i < n ; i++){

//     let count = 0 

//   for(let j = 0 ; j < n ; j++){
//      if(nums[i] === nums[j]){
//        count++
//      }
//   }

//   if(count > Math.floor(n / 2)){
//        return nums[i]
//   }
//   }
//   return -1
// }

// let nums = [7, 0, 0, 1, 7, 7, 2, 7, 7]
// console.log(majorityElement(nums))


//or 

// function majorityElement(nums){
//    let n = nums.length

//    let map = new Map()

//    for(let num of nums){
//      map.set(num , (map.get(num) || 0) + 1)
//    }

//    for(let [key , value] of map){
//      if(value > n/2){
//       return key
//      }
//    }

//    return -1
// }

// let nums = [7, 0, 0, 1, 7, 7, 2, 7, 7]

// console.log(majorityElement(nums))

//______________________________________________________

//kadane's algorithm 

// function maxSubArr(arr){
//    let mexi = arr[0]

//    for(let i = 0 ; i < arr.length ; i++){
      
//      let sum = 0 

//      for(let j = i ; j < arr.length ; j++){
//       sum += arr[j]

//       mexi = Math.max(mexi , sum)
//      }
//    }
//    return mexi
// }

// let arr = [-2, -3, -7, -2, -10, -4]
// console.log(maxSubArr(arr))

//or

// function maxSubArr(arr){
//    let mexi = arr[0]
   
//    let sum = 0

//    for(let i = 0 ; i < arr.length ; i++){
//        sum += arr[i]

//        if(sum > mexi){
//           mexi = sum
//        }

//        if( sum < 0){
//         sum = 0
//        }
//    }

//    return mexi
// }

// let arr = [-2, -3, -7, -2, -10, -4]
// console.log(maxSubArr(arr))

//________________________________________________

// function BuyAndSellStock(prices){
   
//    let maxProfit = 0

//    for(let i = 0 ; i < prices.length ; i++){
      
//      for(let j = i+1 ; j < prices.length ; j++){
//         let profit = prices[j] - prices[i]

//         maxProfit = Math.max(maxProfit , profit)
//      }
//    }

//    return maxProfit

// }

// let prices = [7, 1, 5, 3, 6, 4]
// console.log(BuyAndSellStock(prices))

//___________________________________________________

// function BuyAndSellStock(prices){
//   let maxProfit = 0 

//   let minPrice = prices[0]

//   for(let price of prices){
//     if(price < minPrice){
//       minPrice = price
//     }

//     else{
//       maxProfit = Math.max(maxProfit , price - minPrice)
//     }
//   }
//   return maxProfit
// }

// let prices = [7, 1, 5, 3, 6, 4]
// console.log(BuyAndSellStock(prices))

//______________________________________________________

//Rearrange array elements by Sign 

// function RearrangeArray(A){
//    let n = A.length
//    let ans = new Array(n).fill(0)

//    let posIndex = 0
//    let negIndex = 1

//    for(let i = 0 ; i < n ; i++){
//        if(A[i] < 0){
//            ans[negIndex] = A[i]
//            negIndex += 2
//        }else{
//            ans[posIndex] = A[i]
//            posIndex += 2
//        }
//    }
//    return ans
// }

// let A = [1 , 2 , -4 , -5]
// console.log(RearrangeArray(A))

//_______________________________________________________

// function nextPermutation(nums){
//    let index = -1 //Matlab Abhi tak mujhe break point nahi mila.

//    //find the breaking point --> break point milne ka matlab uske baad wala part strictly decreasing hota hai jaise for example 7 4 3 1 or 9 8 5 2 
//    for(let i = nums.length - 2 ; i >= 0 ; i--){
//       if(nums[i] < nums[i + 1]){
//          index = i
//          break
//       }
//    }
   
//    //agar man le breaking point nii mila then
//     if(index === -1){
//       nums.reverse()
//       return
//     }

//    //find the just larger element
//    for(let i = nums.length - 1 ; i > index ; i--){
//        if(nums[i] > nums[index]){
//           //swap
//         [nums[i] , nums[index]] = [nums[index] , nums[i]]
//         break
//        }
//    }

//    //now reverse
//    let left = index + 1 , right = nums.length - 1
//    while(left < right){
//      [nums[left] , nums[right]] = [nums[right] , nums[left]]
//      left++
//      right--
//    }

// }

// let nums = [1, 2 , 3]
// nextPermutation(nums)
// console.log(nums)

//________________________________________________________

//leaders in an Array 

// function leaders(nums){
//   let ans = []

//   for(let i = 0 ; i < nums.length ; i++){
//     let leader = true;

//     for(let j = i + 1 ; j < nums.length ; j++){
//       if(nums[j] >= nums[i]){
//         leader = false 
//         break
//       }
//     }

//     if(leader){
//       ans.push(nums[i])
//     }
//   }
//   return ans
// }

// let nums = [4, 7, 1, 0] 
// console.log(leaders(nums))

//or 

// function leaders(nums){
//   let ans = []

//   if(nums.length === 0){
//     return ans
//   }

//   let max = nums[nums.length - 1]
//   ans.push(nums[nums.length - 1])

//   //right se element to check kar thik hai 

//   for(let i = nums.length - 2 ; i >= 0 ; i--){
//      if(nums[i] > max){
//       ans.push(nums[i])
//       max = nums[i]
//      }
//   }
//   ans.reverse()
//   return ans
  
// }

// let nums = [4, 7, 1, 0] 
// console.log(leaders(nums))

//________________________________________________________

//longest consecutive sequence 

// function longestConsecutiveSequence(nums){
//    let n = nums.length
//    if(n === 0) return 0

//    let set = new Set(nums)
//    let longest = 0

//    for(let num of set){
//       if(!set.has(num - 1)){
//         let current = num
//         let count = 1 

//       while(set.has(current + 1)){
//         current++
//         count++
//       }
//       longest = Math.max(longest , count)
//       }
//    }
//       return longest
// }

// let nums = [100, 4, 200, 1, 3, 2]
// console.log(longestConsecutiveSequence(nums))

//_________________________________________________________

//set matrix to zero

// function setZeroes(matrix){
//    const m = matrix.length
//    const n = matrix[0].length

//    const row = new Array(m).fill(false)
//    const col = new Array(n).fill(false)

//    for(let i = 0 ; i < m ; i++){
//     for(let j = 0 ; j < n ; j++){
//        if(matrix[i][j] === 0){
//         row[i] = true
//         col[j] = true
//        }
//     }
//    }

//    for(let i = 0 ; i < m ; i++){
//     for(let j = 0 ; j < n ; j++){
//       if(row[i] || col[j]){
//         matrix[i][j] = 0
//       }
//     }
//    }
// }

// let matrix = [[1,1,1],[1,0,1],[1,1,1]]
// setZeroes(matrix)
// console.log(matrix)

//___________________________________________________________

// function rotateClockWise(matrix){
//   let n = matrix.length

//   let rotated = Array.from({length : n} , ()=>Array(n).fill(0))

//    for(let i = 0 ; i < n ; i++){
//      for(let j = 0 ; j < n ; j++){
//       rotated[j][n - i - 1] = matrix[i][j]
//      }
//    }
//    return rotated
// }

// const matrix = [
//     [1, 2, 3],
//     [4, 5, 6],
//     [7, 8, 9]
// ];

// const rotated = rotateClockWise(matrix)
// console.log(rotated)

//or

// function rotateClockWise(matrix){
//   let n = matrix.length


//    for(let i = 0 ; i < n ; i++){
//      for(let j = i + 1 ; j < n ; j++){
//      [matrix[i][j] , matrix[j][i]] = [matrix[j][i] , matrix[i][j]]
//      }
//    }
//   for(let i = 0 ; i < n ; i++){
//    matrix[i].reverse()
//   }
// }

// const matrix = [
//     [1, 2, 3],
//     [4, 5, 6],
//     [7, 8, 9]
// ];

// rotateClockWise(matrix)
// console.log(matrix)

//________________________________________________

//merge two sorted lists

// function mergeSortedLists(arr1 , arr2){
//   let dummy = new ListNode(0)
//   let current = dummy

//   while(arr1 !== null && arr2 !== null){
//     if(arr1.val <= arr2.val){
//       current.next = arr1
//       arr1 = arr1.next
//     }else{
//       current.next = arr2
//       arr2 = arr2.next
//     }
//     current = current.next
//   }
//   if(arr1 != null){
//       current.next = list1
//   }
//   if(arr2 !== null){
//     current.next = list2
//   }
//   return dummy.next
// }

// console.log(mergeSortedLists(arr1 , arr2))

