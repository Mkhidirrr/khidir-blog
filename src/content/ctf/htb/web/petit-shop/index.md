---
title: "HTB: Petit Shop - SQL Injection to RCE"
platform: HTB
category: web
difficulty: Medium
points: 30
date: 2023-12-15
tags: [web, sqli, rce, php]
description: "Exploiting SQL injection in a PHP e-commerce platform to achieve remote code execution"
---

# Petit Shop Writeup

## Initial Reconnaissance
First, let's examine the web application structure:
- Identified vulnerable endpoints
- Mapped application functionality
- Located input points for testing

## SQL Injection Discovery
Found vulnerable parameter in shopping cart:

```sql
' UNION SELECT 1,2,3,4,5,6 -- -
```

## Exploitation Steps
1. SQL injection to extract database information
2. Found credentials in database
3. Used credentials to gain admin access
4. Uploaded malicious file for RCE
5. Achieved shell access
