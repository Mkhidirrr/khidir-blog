---
title: "PicoCTF: Wireshark Doo Dooo"
platform: PicoCTF
category: forensics
difficulty: Easy
points: 50
date: 2023-12-22
tags: [forensics, wireshark, packet-analysis]
description: "Network packet analysis using Wireshark to find hidden data"
---

# Wireshark Doo Dooo Writeup

## Challenge Overview
Analyzing network traffic to find hidden flag.

## HTTP Stream Analysis
Following HTTP stream revealed encoded data:

```bash
echo "UGljb0NURnt..." | base64 -d
```

## Flag Discovery
1. Located suspicious HTTP traffic
2. Extracted base64 encoded data
3. Decoded to reveal flag
