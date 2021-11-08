// ARCC Generated Code
// Version 1.0.0

#include "arc.hpp"

int fib(int n)
{
    if (n <= 1)
    {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}
int main()
{
    console::log(fib(1));
    console(fib(3));
}
