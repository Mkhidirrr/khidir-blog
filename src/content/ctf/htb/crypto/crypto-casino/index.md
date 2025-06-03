---
title: "HTB: Crypto Casino"
platform: HTB
category: crypto
difficulty: Medium
points: 40
date: 2023-12-26
tags: [crypto, prng, math]
description: "Exploiting a vulnerable PRNG implementation in an online casino game"
---

# Crypto Casino Walkthrough

## Game Analysis
Understanding the PRNG:
```python
def generate_number():
    seed = int(time.time())
    random.seed(seed)
    return random.randint(1, 100)
```

## Exploit Development
Predicting next numbers...
