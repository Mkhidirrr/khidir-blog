---
title: "HTB: Return to libc"
platform: HTB
category: pwn
difficulty: Hard
points: 50
date: 2023-12-27
tags: [pwn, buffer-overflow, ret2libc]
description: "Classic return-to-libc exploitation bypassing ASLR and NX"
---

# Return to libc Exploitation

## Binary Analysis
```bash
checksec --file=./binary
```

## Exploit Development
```python
from pwn import *

# Setup binary and libc
elf = context.binary = ELF('./binary')
libc = ELF('./libc.so.6')
```
