# Capstone Reflection

Throughout this course, the most difficult concept to master was designing scalable, concurrent systems capable of handling race conditions—specifically preventing double-booking and maintaining state consistency under heavy write loads. I overcame this challenge by deeply understanding database transactions, row-level locking (`FOR UPDATE`), and the architectural separation between static reads and transactional writes.

Based on the feedback received during my project reviews, the primary area I would improve in my capstone is implementing more granular cache invalidation strategies. While caching dramatically improves read performance, ensuring that cache layers synchronize instantly with database writes without stale data requires meticulous event-driven hooks. 

Moving forward, I am eager to learn advanced distributed systems patterns, including microservices communication via gRPC, event-driven architectures using Apache Kafka, and containerized deployment orchestration with Kubernetes. These skills will allow me to translate theoretical system design into resilient, cloud-native production environments.
