
function fib(n: number): number {
    if (n <= 1) {
        return n;
    }
        
    return fib(n-1) + fib(n-2);
}

let debug: boolean = false;

function main(): number {
    console.log(fib(1));
    console.log(fib(3));

    if(debug) {
        let num: number = fib(10)
        if(num > 5) {
            console.log("Above 5");
        } else if ( num < 5) {
            console.log("Below 5")
        } else {
            console.log("Is 5")
        }
        
    } 

    return 0;
}   


