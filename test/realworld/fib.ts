
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
        console.log(fib(5));
    }

    return 0;
}   


