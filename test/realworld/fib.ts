
function fib(n: int): int {
    if (n <= 1) {
        return n;
    }
        
    return fib(n-1) + fib(n-2);
}

function main(): int {
    console.log(fib(1));
    console.log(fib(3));
}   


