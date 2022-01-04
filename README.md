# IMPORTANT NOTE
Conversion from C++ to LLVM's IR is starting, code is in full dev and not likley to be fully functional

# FastTS
Typescript is a great language, a less error prone and harder typed version of javascript. Typescript does have two downsides however, those being it is slow compared to low level languages, and it cannot interface 
with hardware like a low level language. Why go through the struggle of trying to use the node ABI or N-API when your whole program can run faster? FastTS aims to fix both. FastTS compiles typescript down to C++, 
then links assembles it using clang. FastTS also aims to be able to compile to mulitple architechtures such as ARM, Arduino, and bare metal x86. Yes, an entirely typescript OS could be possible.

## Goals
Building a faster typescript compiler is no easy challenge, so I've broken it up into compiler versions. The end goal of this, is that this repository will compile to an blazing fast executable. Versions use standard SemVer protocol.

## Pre Alpha
### Version 0.1.0:
    Global / Functional Variable declaration
        Number Literals
        Binary Expressions
        Function Calls
    Variable Types:
        Integer Numbers
    Functions / Function Calls
        Code Blocks
        Parameters
        Return Statements
    If Statements
        All operators (<, >, <=, >=, etc.)
        Else
        Else if

### Version 0.2.0:
    Full Unary Operations
    For Loops
    Strings
    Arrays
    Objects

### Version 0.3.0:
    