; ModuleID = "main"
source_filename =" main"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-pc-linux-gnu"

declare dso_local i32 @printf(i8* %2 readonly nocapture, ... %3 )

define dso_local i32 @sum(i32 %0 , i32 %1 ) {
        %3 = mul i32 1 1
        %4 = sub i32 1 %3
        %5 = add i32 x %4
        %6 = add i32 %5 2
        ret i32 %6
}