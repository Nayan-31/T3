# 🚀 Next Permutation - Complete Hinglish Notes (With Code)

# Problem
Given an array, find its **next lexicographically greater permutation**.

Example:

```
Input : [1,2,3]
Output: [1,3,2]
```

---

# Complete Code

```javascript
function nextPermutation(nums){
   let index = -1; // Break point not found yet

   // STEP 1: Find Break Point
   for(let i = nums.length - 2; i >= 0; i--){
      if(nums[i] < nums[i + 1]){
         index = i;
         break;
      }
   }

   // If already the largest permutation
   if(index === -1){
      nums.reverse();
      return nums;
   }

   // STEP 2: Find Just Larger Element
   for(let i = nums.length - 1; i > index; i--){
      if(nums[i] > nums[index]){
         [nums[i], nums[index]] = [nums[index], nums[i]];
         break;
      }
   }

   // STEP 3: Reverse the suffix
   let left = index + 1;
   let right = nums.length - 1;

   while(left < right){
      [nums[left], nums[right]] = [nums[right], nums[left]];
      left++;
      right--;
   }

   return nums;
}

let nums = [1,2,3];
console.log(nextPermutation(nums));
```

Output

```
[1,3,2]
```

---

# Step 1 - Find Break Point (Decreasing Point)

Condition:

```javascript
nums[i] < nums[i+1]
```

Example:

```
1 2 7 4 3 1

3<1 ❌
4<3 ❌
7<4 ❌
2<7 ✅
```

Break Point = 2

---

# Doubt
## Why index = -1 ?

Because initially we don't know whether a break point exists.

```
-1 = Not Found
```

Example

```
3 2 1
```

No break point.

So reverse whole array.

---

# Doubt
## Why return instead of break?

```javascript
if(index===-1){
   nums.reverse();
   return;
}
```

Reason:

- break exits only loops.
- return exits the whole function.

---

# Step 2 - Find Just Larger Element

```javascript
for(let i = nums.length-1; i>index; i--){
   if(nums[i] > nums[index]){
      swap...
      break;
   }
}
```

Example

```
1 2 | 7 4 3 1
```

Searching from right

```
1 >2 ❌
3 >2 ✅
```

Swap

```
1 3 7 4 2 1
```

---

# Biggest Doubt I Asked

"If 7 also greater than 2, why don't we swap with 7?"

Answer:

Because the suffix after the break point is ALWAYS decreasing.

```
7 4 3 1
```

Searching from right automatically gives the **smallest greater element**.

That's why 3 is chosen instead of 4 or 7.

A case where 7 is chosen before a smaller valid element cannot exist once the break point is correctly found.

---

# Step 3 - Reverse the Suffix

Current

```
1 3 | 7 4 2 1
```

Reverse only right part

```
1 3 | 1 2 4 7
```

Final Answer

```
1 3 1 2 4 7
```

---

# Another Doubt

Break Point == Decreasing Point ?

✅ YES

Both mean the same thing.

---

# Another Doubt

Why output was undefined?

Wrong

```javascript
console.log(nextPermutation(nums));
```

when function doesn't return.

Correct

```javascript
nextPermutation(nums);
console.log(nums);
```

or return nums at the end.

---

# Complexity

Time : O(n)

Space : O(1)

---

# Interview Summary

1. Find Break Point.
2. Find Just Larger Element.
3. Swap.
4. Reverse the Suffix.

Remember:

> Break Point ke baad wala part hamesha decreasing hota hai.
> Isi wajah se right se pehla greater element hi Just Larger Element hota hai.

---------------------------------------------------------------------------------------------

what's the difference between 

for(let i = 0 ; i <  arr.length ; i++){
   for(let j = 0 ; j < arr.length ; j++){
}
}
                   and

for(let i = 0 ; i <  arr.length ; i++){
   for(let j = i ; j < arr.length ; j++){
}
}

Haan, dono loops ka main difference inner loop kaha se start hota hai.

1. j = 0
i = 0 → j = 0,1,2,3
i = 1 → j = 0,1,2,3
i = 2 → j = 0,1,2,3
i = 3 → j = 0,1,2,3

2. j = i
i = 0 → j = 0,1,2,3
i = 1 → j = 1,2,3
i = 2 → j = 2,3
i = 3 → j = 3