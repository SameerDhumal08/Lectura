package com.lectura.notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
  List<Notification> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
