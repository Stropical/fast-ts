# ArcLang
Typescript is a great language, a less error prone and harder typed version of javascript. Typescript does have two downsides however, those being it is slow compared to low level languages, and it cannot interface 
with hardware like a low level language. Why go through the struggle of trying to use the node ABI or N-API when your whole program can run faster? Arc aims to be written similar typescript with the ability to compile down to LLVM IR. IR can then go to native binary on most platforms.

## Current goals
 - Variable allocation and use
 - Expression parsing
 - Return statements
 - Basic functions with return types
