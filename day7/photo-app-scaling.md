# SnapShare - Scaling Plan & System Architecture

## 1. Assumptions & Daily Active Users (DAU)
* **Total Registered Users:** 10,000,000
* **Daily Active User (DAU) Rate:** 10% of total users
* **Calculated Daily Active Users (DAU):** 
  $$\text{10,000,000 users} \times 0.10 = \mathbf{1,000,000\text{ active users/day}}$$
* **Per-User Activity:** 
  * Each active user uploads **1 photo per day**.
  * Each active user views **50 feed pages per day** (assuming 20 photos per feed page view, or treated directly as 50 feed view requests/actions per user daily).
* **File Size Specs:** 
  * Original photo size = **2 MB**
  * Thumbnail size = **50 KB** (0.05 MB)

---

## 2. Traffic & Storage Calculations

### A. Uploads Per Second (Write Rate)
* **Total Uploads per Day:** $1,000,000 \text{ users} \times 1 \text{ upload/day} = 1,000,000 \text{ uploads/day}$
* **Average Uploads/sec:** 
  $$\frac{1,000,000 \text{ uploads}}{86,400 \text{ seconds}} \approx \mathbf{11.57 \text{ writes/sec}}$$
* **Peak Uploads/sec (5× multiplier):** 
  $$11.57 \times 5 \approx \mathbf{57.85 \text{ writes/sec}}$$

### B. Feed Views Per Second (Read Rate)
* **Total Feed Views per Day:** $1,000,000 \text{ users} \times 50 \text{ feed views/day} = 50,000,000 \text{ feed views/day}$
* **Average Feed Views/sec:** 
  $$\frac{50,000,000 \text{ views}}{86,400 \text{ seconds}} \approx \mathbf{578.7 \text{ reads/sec}}$$
* **Peak Feed Views/sec (5× multiplier):** 
  $$578.7 \times 5 \approx \mathbf{2,893.5 \text{ reads/sec}}$$

### C. Photo Storage Per Year
* **Daily Original Storage:** $1,000,000 \text{ uploads} \times 2 \text{ MB} = 2,000,000 \text{ MB/day} = 2,000 \text{ GB/day} = 2 \text{ TB/day}$
* **Daily Thumbnail Storage:** $1,000,000 \text{ uploads} \times 0.05 \text{ MB} = 50,000 \text{ MB/day} = 50 \text{ GB/day}$
* **Total Combined Daily Storage:** $2,000 \text{ GB} + 50 \text{ GB} = 2,050 \text{ GB/day}$ ($2.05 \text{ TB/day}$)
* **Annual Storage (365 days):** 
  $$2.05 \text{ TB/day} \times 365 \text{ days} = \mathbf{748.25 \text{ TB/year}}$$

---

## 3. Read-Heavy vs. Write-Heavy Analysis
SnapShare is heavily **read-heavy**. With approximately ~579 average reads per second compared to only ~12 average writes per second (a read-to-write ratio of roughly 50:1), the system's primary scaling bottleneck will be serving feed views and images to users, rather than handling photo uploads. 
* **Design Implications:** This means our architecture must prioritize caching, database read replicas, and Content Delivery Networks (CDNs) to scale read operations efficiently without overloading our primary database.

---

## 4. Why Photos Should Not Be Stored Inside the Database
Relational or standard databases are optimized for structured tabular data, fast querying, ACID transactions, and indexing—not for storing massive binary large objects (BLOBS) like multi-megabyte image files. Storing raw image binaries directly inside a database would bloat database storage sizes, degrade backup and restore speeds, spike memory consumption, and severely slow down query performance. 
* **Where they go instead:** Raw photo files and thumbnails should be stored in **Object Storage** (such as AWS S3 or Google Cloud Storage), while the database only stores lightweight text metadata (such as the image file URL path, user ID, upload timestamp, and caption).

---

## 5. System Architecture Diagram

```text
 [Client / Mobile App]
          │
          ▼
   [Content Delivery Network (CDN)] ── (Serves static photos/thumbnails globally)
          │
          ▼
    [Load Balancer] ─────────────── (Distributes incoming API requests)
          │
          ├────────────────────────┐
          ▼                        ▼
    [App Servers]            [App Servers]
          │                        │
          ├──────────┬─────────────┤
          ▼          ▼             ▼
      [Cache]   [Primary DB]  [Read Replicas]
                 (Writes)        (Reads)
          │
          ▼
   [Message Queue] ──────────────> [Background Workers] ──> [Object Storage]
                                   (Generates Thumbnails)    (S3 / Cloud Storage)
