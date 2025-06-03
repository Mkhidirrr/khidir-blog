---
title: "PicoCTF: Suspicious Traffic"
platform: PicoCTF
category: forensics
difficulty: Medium
points: 100
date: 2023-12-28
tags: [forensics, wireshark, network]
description: "Analyzing suspicious network traffic to find hidden data exfiltration"
---

# Network Traffic Analysis

## Initial Analysis
Wireshark statistics:
```bash
tshark -r capture.pcap -q -z io,phs
```

## DNS Exfiltration
Found encoded data in DNS queries...
