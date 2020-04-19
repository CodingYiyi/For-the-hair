let count = 1
module.exports = count

setTimeout(_=>{
    count++
    console.log("module.exports",module.exports)
},1000)


