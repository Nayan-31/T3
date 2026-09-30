# Multi-Agent System Basics

Ye README multi-agent system ke basic building blocks ko simple Hinglish me explain karta hai.

---

## 1. Identity

**Identity** ka matlab hota hai:

> **Agent kaun hai aur system ke andar uska role kya hai?**

Example:

```txt
Identity:
You are a Backend Developer Agent.
You specialize in Node.js, Express, MongoDB and API design.
```

Yaha agent ki identity define karti hai ki wo kis role me kaam karega.

Example roles:

```txt
Research Agent
Coding Agent
Reviewer Agent
Planner Agent
Security Agent
```

### Short me

```txt
Identity = Main kaun hoon?
```

---

## 2. Goal

**Goal** ka matlab hota hai:

> **Agent ko final me achieve kya karna hai?**

Example:

```txt
Identity:
You are a Research Agent.

Goal:
Find the latest information about React Server Components.
```

Yaha:

```txt
Identity = Research Agent
Goal = React Server Components ke baare me information find karna
```

### Short me

```txt
Goal = Mujhe achieve kya karna hai?
```

---

## 3. Instructions

**Instructions** batati hain:

> **Agent ko apna kaam kaise karna hai?**

Example:

```txt
Identity:
You are a Backend Developer Agent.

Goal:
Build a secure login API.

Instructions:
- Use Node.js and Express
- Validate email and password
- Hash passwords with bcrypt
- Use JWT for authentication
- Return proper HTTP status codes
- Do not expose passwords
```

Goal sirf final objective batata hai.

Instructions working rules aur approach batati hain.

### Short me

```txt
Instructions = Mujhe kaam kaise karna hai?
```

---

## 4. Model

**Model** ka matlab hota hai:

> **Agent ke peeche kaunsa AI model / LLM run karega?**

Example:

```txt
Identity:
You are a Coding Agent.

Goal:
Fix bugs in the application.

Model:
GPT-5.6 Sol
```

Different agents ke liye different models use kiye ja sakte hain.

Example:

```txt
Research Agent
→ Powerful reasoning model

Simple Classifier Agent
→ Fast / smaller model

Coding Agent
→ Strong coding model
```

### Short me

```txt
Model = Agent ka AI brain
```

---

## 5. Tools

**Tools** ka matlab hota hai:

> **Agent ke paas kaun-kaun si external capabilities hain?**

Example:

```txt
Identity:
You are a Research Agent.

Tools:
- Web Search
- Browser
- PDF Reader
```

Coding agent ke tools:

```txt
Tools:
- Terminal
- File Reader
- File Writer
- GitHub
```

Important:

```txt
Model = Sochta hai
Tool = Action leta hai
```

### Short me

```txt
Tools = Agent kya-kya kar sakta hai?
```

---

## 6. Context

**Context** ka matlab hota hai:

> **Current task samajhne ke liye agent ke paas kaunsi relevant background information hai?**

Example:

```txt
Identity:
You are a Coding Agent.

Goal:
Fix login bug.

Context:
- Project Next.js me hai
- MongoDB use ho raha hai
- JWT authentication hai
- Error login route me aa raha hai
```

Context facts aur background deta hai.

### Context vs Instructions

```txt
Context:
Project React me bana hai.

Instruction:
Existing React architecture ko change mat karna.
```

Difference:

```txt
Context = Background information
Instructions = Working rules
```

### Short me

```txt
Context = Abhi situation ke baare me kya pata hai?
```

---

## 7. Memory

**Memory** ka matlab hota hai:

> **Agent past interactions se kya information yaad rakhta hai?**

Example:

```txt
Memory:
- User prefers Hinglish explanations
- User is learning Next.js
- User likes simple examples
```

Future me agent is information ko reuse kar sakta hai.

### Context vs Memory

```txt
Context:
Current task ki information

Memory:
Past se saved information
```

Example:

```txt
Context:
Current error is "JWT token expired"

Memory:
Earlier JWT expiry 1 hour set ki gayi thi
```

### Short me

```txt
Memory = Pehle se kya yaad hai?
```

---

## 8. Input

**Input** ka matlab hota hai:

> **Agent ko current run me kya request ya data diya gaya hai?**

Example:

```txt
Input:
"Is code me bug find karo"

Code:
function add(a, b) {
  return a - b
}
```

Ye current data hai jo agent ko process karna hai.

### Input vs Context

```txt
Context:
Project Next.js me hai.

Input:
"Login API me JWT malformed error aa raha hai."
```

Difference:

```txt
Context = Background
Input = Current task
```

### Short me

```txt
Input = Abhi mujhe kya mila hai?
```

---

## 9. Output

**Output** ka matlab hota hai:

> **Agent task process karne ke baad kya return karega?**

Example:

```txt
Input:
"Is code ka bug fix karo"
```

Possible output:

```txt
Output:
Corrected code + short explanation
```

Output format bhi define kiya ja sakta hai.

Example:

```txt
Output:
- Return JSON only
- Include summary
- No markdown
```

### Short me

```txt
Output = Mujhe final me kya return karna hai?
```

---

## 10. Permissions

**Permissions** ka matlab hota hai:

> **Agent ko kya karne ki ijazat hai aur kya karne ki ijazat nahi hai?**

Example:

```txt
Tools:
- File Reader
- File Writer
- Terminal
```

Permissions:

```txt
Permissions:
- Files read kar sakta hai
- New files create kar sakta hai
- Production files delete nahi kar sakta
```

Important difference:

```txt
Tools = Capability available hai
Permissions = Capability use karne ki permission hai
```

Example:

```txt
Tool:
Gmail

Permission:
Read-only
```

Matlab Gmail access available hai, lekin agent email send nahi kar sakta.

### Short me

```txt
Permissions = Mujhe kya karne ki allow hai?
```

---

## 11. Guardrails

**Guardrails** ka matlab hota hai:

> **Agent ke safety rules aur hard boundaries.**

Example:

```txt
Guardrails:
- Passwords expose mat karo
- Production database delete mat karo
- Secrets hardcode mat karo
- Unsafe commands execute mat karo
- Sensitive information unnecessarily share mat karo
```

### Permissions vs Guardrails

Example:

```txt
Permission:
Agent production server read kar sakta hai.

Guardrail:
Production data modify/delete nahi karega.
```

Another example:

```txt
Permission:
Email send karne ka access hai.

Guardrail:
Sensitive information automatically send mat karo.
```

Difference:

```txt
Permissions = Kya allowed hai?
Guardrails = Safety ke liye kya nahi karna chahiye?
```

### Short me

```txt
Guardrails = Safety boundaries
```

---

## 12. Handoff Rules

**Handoff Rules** ka matlab hota hai:

> **Ek agent ko kaam kab, kis agent ko aur kis information ke saath transfer karna hai?**

Example flow:

```txt
User
 ↓
Planner Agent
 ↓
Research Agent
 ↓
Coding Agent
 ↓
Reviewer Agent
 ↓
Final Answer
```

Example handoff rules:

```txt
Handoff Rules:

- Agar research required ho
  → Research Agent ko handoff karo

- Research complete ho jaye
  → Findings Coding Agent ko do

- Coding complete ho jaye
  → Reviewer Agent ko code do

- Reviewer ko bug mile
  → Coding Agent ko wapas bhejo

- Review pass ho jaye
  → Final result return karo
```

Handoff ke time sirf agent change nahi hota.

Relevant information bhi transfer honi chahiye.

Example:

```txt
Research Agent → Coding Agent

Handoff Data:
- Research findings
- Important sources
- Requirements
- Constraints
```

### Short me

```txt
Handoff Rules = Kaam kab aur kisko transfer karna hai?
```

---

# Complete Summary

```txt
1. Identity
   → Main kaun hoon?

2. Goal
   → Mujhe achieve kya karna hai?

3. Instructions
   → Mujhe kaam kaise karna hai?

4. Model
   → Kaunsa AI brain use hoga?

5. Tools
   → Main kya-kya kar sakta hoon?

6. Context
   → Current background kya hai?

7. Memory
   → Pehle se kya yaad hai?

8. Input
   → Abhi mujhe kya mila hai?

9. Output
   → Mujhe return kya karna hai?

10. Permissions
    → Mujhe kya karne ki allow hai?

11. Guardrails
    → Safety boundaries kya hain?

12. Handoff Rules
    → Kaam kab aur kisko transfer karna hai?
```

---

# Simple Multi-Agent Example

```txt
Agent 1

Identity:
You are a Research Agent.

Goal:
Research authentication best practices.

Instructions:
- Use reliable sources
- Keep findings concise

Tools:
- Web Search

Output:
Research findings

Handoff Rules:
Send findings to Coding Agent.
```

```txt
Agent 2

Identity:
You are a Coding Agent.

Goal:
Build authentication using the research.

Context:
Research Agent ke findings

Tools:
- File Reader
- File Writer
- Terminal

Permissions:
Can modify development files.

Guardrails:
Do not expose secrets.

Output:
Working authentication code

Handoff Rules:
Send completed code to Reviewer Agent.
```

```txt
Agent 3

Identity:
You are a Reviewer Agent.

Goal:
Check authentication code.

Instructions:
- Check security
- Check bugs
- Check code quality

Input:
Coding Agent ka code

Output:
Approved code or list of fixes

Handoff Rules:
If bugs exist → Coding Agent
If everything is correct → Final Output
```

---

# Final Mental Model

Ek multi-agent system ko simple tarike se aise imagine kar sakte ho:

```txt
Identity
   ↓
Agent ka role

Goal
   ↓
Uska objective

Instructions
   ↓
Kaam karne ka tarika

Model
   ↓
AI brain

Tools
   ↓
External capabilities

Context + Memory
   ↓
Agent ko kya pata hai

Input
   ↓
Current request

Permissions + Guardrails
   ↓
Agent ki boundaries

Output
   ↓
Result

Handoff Rules
   ↓
Next agent ko kaam transfer
```

Is tarah multiple specialized agents milkar ek large task ko efficiently complete kar sakte hain.