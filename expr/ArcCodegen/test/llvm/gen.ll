; ModuleID = "test.cpp"
source_filename =" test.cpp"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-pc-linux-gnu"

@.str = constant [4 x i8] c"yes\00", align 1

declare dso_local i32 @printf(i8* readonly nocapture, ... )

define dso_local i32 @main() { 
	%1 = alloca i32, align 4
	%2 = alloca i32, align 4
	ret i32 0
}
        
