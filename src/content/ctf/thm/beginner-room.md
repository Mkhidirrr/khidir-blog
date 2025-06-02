---
title: "Basic Pentesting"
platform: THM
difficulty: Easy
date: 2023-09-21
tags: [linux, webapp, brute-force, enumeration]
draft: false
description: "Learn the basic concepts of pentesting by exploiting a vulnerable web server"
points: 0
solved: true
---

## Room Overview
- Name: Basic Pentesting
- Difficulty: Easy
- Categories: Security, Web, Privilege Escalation

## Initial Foothold
```bash
# Directory enumeration
gobuster dir -u http://10.10.X.X -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
```

## Exploitation Path
1. Found hidden directory
2. Discovered webapp vulnerabilities
3. Gained initial access
4. Privilege escalation

## Tools Used
- Gobuster
- Hydra
- LinPEAS

## Lessons Learned
- Web enumeration techniques
- Password cracking methodology
- Linux privilege escalation vectors
