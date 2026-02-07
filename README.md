# ☕ Bean & Brew – Smart Barista Queue System

🚀 **Hackathon Project | Backend-Focused Intelligent Scheduling System**

Bean & Brew is a **smart coffee shop order queuing and simulation system** designed to handle heavy morning rush (7–10 AM) using **dynamic priority scheduling**, fairness rules, and workload balancing across baristas.

This project solves the classic **“first-come-first-served is inefficient”** problem using a **real-time, priority-based algorithm**.

---

## 🧠 Problem Statement

During peak hours, Bean & Brew café receives **200–300 customers** with only **3 baristas**.

### Challenges:
- Long wait times for simple orders
- Customer frustration after 8–10 minutes
- Unbalanced barista workload
- Fairness (customers see others getting served first)

---

## 🎯 Solution Overview

We built a **Dynamic Priority Queue System** that:

✅ Minimizes average wait time  
✅ Guarantees **no customer waits more than 10 minutes**  
✅ Balances barista workload  
✅ Handles customer psychology & fairness  
✅ Supports large-scale **simulation & statistics**

---

## 🏗️ Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3**
- **Spring Data JPA**
- **H2 In-Memory Database**
- **Spring Scheduler**
- **REST APIs**

### Tools
- Postman (API testing)
- IntelliJ IDEA

---

## 📦 Core Features

### ☕ Order Management
- Supports multiple drink types:
  - Cold Brew (1 min)
  - Espresso (2 min)
  - Americano (2 min)
  - Cappuccino (4 min)
  - Latte (4 min)
  - Mocha (6 min)

### 🧮 Priority-Based Scheduling
Each order gets a **priority score (0–100)** based on:

| Factor | Weight |
|------|-------|
| Wait Time | 40% |
| Order Complexity | 25% |
| Urgency (approaching timeout) | 25% |
| Loyalty (regular customer) | 10% |

---

### ⚠️ Emergency Handling
- If wait time ≥ 8 minutes → **Emergency priority boost**
- Ensures no order crosses **10 minutes (hard constraint)**

---

### ⚖️ Fairness Enforcement
- Tracks how many times an order is skipped
- Prevents starvation
- Ensures transparency & justified reordering

---

### 👨‍🍳 Barista Workload Balancing
- 3 baristas (B1, B2, B3)
- Overloaded baristas prefer short orders
- Underutilized baristas handle complex drinks

---

## 📊 Simulation & Statistics Module (Highlight Feature)

### 🔁 Test Case Simulation
- **10 test cases**
- Each test case simulates **200–300 orders**
- Mimics real morning rush conditions

---

### 📈 Statistics Generated Per Test Case
- Average wait time
- Orders handled by:
  - Barista 1
  - Barista 2
  - Barista 3
- Number of customer complaints (escalated to manager)

---

### 🔍 Expandable Order View
- Clicking a test case shows:
  - All 200–300 orders
  - Drink type
  - Assigned barista
  - Wait time
  - Priority score
  - Abandonment status

---

## 🔗 REST API Endpoints

### Orders
👩‍💻 Author

Kiran Jaiswal
Hackathon Project – Backend Engineering
Java | Spring Boot | System Design

⭐ Final Note

This project demonstrates real-world system design, scalability thinking, and data-driven optimization under constraints.

☕ Smart queue. Happy customers. Efficient baristas.
