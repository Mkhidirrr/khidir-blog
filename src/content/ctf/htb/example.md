---
title: "Starting Point - Meow"
platform: HTB
difficulty: Easy
date: 2023-09-21
tags: [linux, telnet, enumeration]
draft: false
description: "A beginner-friendly machine to learn basic enumeration"
points: 10
solved: true
---

## Machine Info
- Name: Meow
- IP: 10.129.X.X
- OS: Linux
- Release Date: 2023-09-21

## Initial Recon
```bash
# Nmap scan
nmap -sV -sC -p- 10.129.X.X

# Results
PORT   STATE SERVICE VERSION
23/tcp open  telnet   Linux telnetd
```

## Exploitation Steps
1. **Service Enumeration**
   ```bash
   telnet 10.129.X.X
   ```

2. **Credential Testing**
   - Tried common usernames: root, admin, user
   - Found valid login with: [REDACTED]

3. **Flag Capture**
   ```bash
   cd /root
   cat flag.txt
   ```

## Key Takeaways
- Importance of default credential testing
- Basic service enumeration
- Linux privilege escalation basics

## Tools Used
- Nmap
- Telnet client

## References
- [HackTheBox Starting Point](https://app.hackthebox.com/starting-point)
- [Telnet Security Best Practices](https://example.com)
