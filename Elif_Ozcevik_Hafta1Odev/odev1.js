const arr = ["Patika","219","Akbank","React","Bootcamp"];

Array.prototype.includeCi = function(search) {
  return Boolean(this.find((n) => n.toLowerCase() === search.toLowerCase()));
}

console.log(arr.includeCi("patika") === true ? "Beklendiği gibi" : "Beklendiği gibi değil")
console.log(arr.includeCi("kırmızı") === true ? "Beklendiği gibi" : "Beklendiği gibi değil")



