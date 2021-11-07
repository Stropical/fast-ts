// ARCC Generated Code
// Version 1.0.0 

#include "arc.hpp"

int fib (int n) {
if (n <= 1) { 
return n;
} 
return fib(n - 1) + fib(n - 2);

}
int main () {
nprint(fib(1));
nprint(fib(3));
nprint(fib(10));
nprint(fib(20));

}
