// 实现两个大数相乘，避免超出范围溢出

function multiply (num1,num2){
    var arr1 = num1.toString().split("").reverse(),arr2 = num2.toString().split("").reverse()
    var l1 = arr1.length,l2=arr2.length
    var res = []
    for( let i=0;i<l1;i++ ){
        for(let j=0;j<l2;j++){
            res[i+j]=arr1[i]*arr2[j] +  (res[i+j]||0)
        }
    }
    for(let i = 0;i<res.length;i++){
        if(res[i]>=10){
            let n = Math.floor(res[i]/10)
            res[i] = res[i]%10;
            res[i+1] += n
        }
    }
    return res.reverse().join("")
}

console.log(multiply(16666,1223456789)) 