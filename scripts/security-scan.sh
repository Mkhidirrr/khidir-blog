#!/bin/bash

# Run dependency security check
npm audit

# Run OWASP ZAP scan
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://khidir-blog.vercel.app

# Run SonarQube analysis
sonar-scanner \
  -Dsonar.projectKey=khidir-blog \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://localhost:9000

# Check for sensitive data exposure
gitleaks detect --source . --verbose
