# TicketHub - System Design & Architecture Specification

## 1. Requirements
### Functional Requirements
- **User Accounts:** Users can sign up, log in, and manage their authentication tokens.
- **Event & Seat Discovery:** Users can browse upcoming events and view real-time seat availability maps.
- **Seat Reservation & Checkout:** Users can temporarily hold a specific seat, submit payment details, and complete ticket purchases.
- **Ticket Management:** Users can access and view their valid purchased tickets and entry QR codes.

### Non-Functional Requirements
- **Speed & Latency:** Seat availability checks and event listings must respond in under 200 ms.
- **Correctness & Consistency:** Zero tolerance for double-booking; strict atomic execution during high-concurrency ticket checkouts.
- **Fairness:** First-come, first-served allocation enforced through temporary 10-minute hold reservation windows.

---

## 2. Traffic & Load Estimates
* **Baseline Assumptions:** 
  * 2,000,000 registered users.
  * Normal day: 50,000 active visitors, each viewing 10 pages = 500,000 page views/day.
  * Normal ticket sales: 5,000 tickets sold per day.
  * 1 day ≈ 100,000 seconds.

### Normal Traffic Calculations
* **Normal Read Rate:** $\frac{500,000 \text{ views}}{100,000 \text{ seconds}} = \mathbf{5 \text{ requests/sec (Average)}}$
* **Normal Write Rate (Sales):** $\frac{5,000 \text{ sales}}{100,000 \text{ seconds}} = \mathbf{0.05 \text{ writes/sec}}$

### "Big Sale" Peak Traffic Calculations (Flash Sale Event)
* **Scenario:** A popular concert goes on sale—**200,000 users** rush to buy **20,000 seats within 10 minutes** (600 seconds).
* **Peak Write Rate (Checkout/Holds):** 
  $$\frac{200,000 \text{ users}}{600 \text{ seconds}} \approx \mathbf{333 \text{ concurrent purchase attempts/sec}}$$
* **Peak Read Rate (Seat Map Refreshing):** Assuming each user refreshes the seating chart 5 times during the rush:
  $$\frac{1,000,000 \text{ reads}}{600 \text{ seconds}} \approx \mathbf{1,666 \text{ reads/sec}}$$
* **Comparison:** The big sale peak spikes write throughput by **6,600×** and read throughput by **330×** compared to normal operations, demanding caching layers and database locking.

---

## 3. REST API Endpoints

| Method | Path | Description | Success Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/events` | List upcoming concerts and events with pagination. | `200 OK` |
| `GET` | `/events/{id}/seats` | Retrieve real-time seat availability and status for an event. | `200 OK` |
| `POST` | `/seats/hold` | Temporarily lock a specific seat for a user (10-minute hold). | `201 Created` |
| `POST` | `/orders` | Complete payment and finalize the ticket purchase. | `201 Created` |
| `GET` | `/users/me/tickets` | Retrieve all valid tickets owned by the authenticated user. | `200 OK` |

---

## 4. Data Model & Schema (`PostgreSQL`)

### Entities & Relationships
1. **`users`**: Stores account credentials and profile details (One-to-Many with orders).
2. **`events`**: Stores concert information and venue details (One-to-Many with seats).
3. **`seats`**: Stores individual venue seats per event, tracking status (`available`, `held`, `booked`) (One-to-Many with orders).
4. **`orders`**: Records completed checkout transactions linking users to specific seats.

### SQL Schema
```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    venue VARCHAR(255) NOT NULL,
    sale_start_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE seats (
    seat_id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    seat_number VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'held', 'booked')),
    held_until TIMESTAMP,
    version INTEGER DEFAULT 1 NOT NULL,
    UNIQUE (event_id, seat_number)
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    seat_id INTEGER NOT NULL REFERENCES seats(seat_id),
    total_amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'completed' NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
