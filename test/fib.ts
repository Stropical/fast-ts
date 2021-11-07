
function fib(n: int): int {
    if (n <= 1) {
        return n;
    }
        
    return fib(n-1) + fib(n-2);
}

function main(): int {
    nprint(fib(1));
    nprint(fib(3));
    nprint(fib(10));
    nprint(fib(20));
}   


