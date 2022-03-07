	.text
	.file	" test.cpp"
	.globl	main                    # -- Begin function main
	.p2align	4, 0x90
	.type	main,@function
main:                                   # @main
	.cfi_startproc
# %bb.0:
	xorl	%eax, %eax
	retq
.Lfunc_end0:
	.size	main, .Lfunc_end0-main
	.cfi_endproc
                                        # -- End function
	.type	.str,@object            # @.str
	.section	.rodata,"a",@progbits
	.globl	.str
.str:
	.asciz	"yes"
	.size	.str, 4

	.section	".note.GNU-stack","",@progbits
