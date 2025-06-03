---
title: "THM: Detection Engineering Practice"
platform: THM
category: purple
difficulty: Hard
date: 2023-12-25
tags: [purple-team, detection, sigma-rules, yara]
description: "Creating and testing detection rules for common attack scenarios"
---

# Detection Engineering Lab

## Attack Simulation
Red team tactics execution:
```bash
empire-client generate stager windows/reverse_https
```

## Sigma Rule Development
```yaml
title: Empire Stager Detection
status: experimental
description: Detects Empire stager execution patterns
references:
  - https://github.com/BC-SECURITY/Empire
author: KhidirID
date: 2023/12/25
detection:
    selection:
        EventID: 1
        CommandLine|contains:
            - 'powershell -noP -sta -w 1 -enc'
    condition: selection
```

## Testing & Validation
Detection validation steps:
1. Rule deployment
2. Attack simulation
3. Alert verification
4. False positive analysis
