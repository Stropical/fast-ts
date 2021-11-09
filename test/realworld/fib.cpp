// ARCC Generated Code
// Version 1.0.0 

#include "arc.hpp"

NumberKeyword fib (NumberKeyword n) {
if (n <= 1) { 
return n;
} 
return fib(n - 1) + fib(n - 2);

}
BooleanKeyword debug = false;
NumberKeyword main () {
console::log(fib(1));
console::log(fib(3));
if (debug == true) { 
console::log(fib(5));
} 

}
