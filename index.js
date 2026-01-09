function removeCharAtIndex(str, index) {
  // Check if index is valid
  if (index < 0 || index >= str.length) {
    return str;
  }
  return str.slice(0, index) + str.slice(index + 1);
}

let s = "tree";
let numOfOccurance = [];
let newArr = [];
for (let i = 0; i < s.length; i++) {
  newArr.push(s.charAt(i));
  let occurance = 1;
  for (let j = i + 1; j < s.length; j++) {
    if (s.charAt(i) == s.charAt(j)) {
      occurance++;
      s = removeCharAtIndex(s, j);
    }
  }
  numOfOccurance.push(occurance);
}

console.log(numOfOccurance);
console.log(newArr);

let ans = []
let highest = numOfOccurance[0]
for(let i = 1 ; i < numOfOccurance.length ; i++) {
    if(numOfOccurance[i] > )
}