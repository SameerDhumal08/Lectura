package com.lectura.notification;
import com.lectura.user.UserAccount;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/notifications")
public class NotificationController {
  private final NotificationRepository repo;
  public NotificationController(NotificationRepository r){ this.repo=r; }

  public record Dto(UUID id, String title, String body, String link, boolean read, java.time.Instant createdAt) {
    static Dto of(Notification n){ return new Dto(n.getId(), n.getTitle(), n.getBody(), n.getLink(), n.isRead(), n.getCreatedAt()); }
  }

  @GetMapping
  public List<Dto> mine(@AuthenticationPrincipal UserAccount me){
    return repo.findByUserIdOrderByCreatedAtDesc(me.getId()).stream().map(Dto::of).toList();
  }

  @PutMapping("/{id}/read")
  public ResponseEntity<?> markRead(@PathVariable UUID id, @AuthenticationPrincipal UserAccount me){
    var n = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Not found"));
    if (!n.getUserId().equals(me.getId())) return ResponseEntity.status(403).build();
    n.setRead(true); repo.save(n); return ResponseEntity.ok().build();
  }

  @PutMapping("/read-all")
  public ResponseEntity<?> markAll(@AuthenticationPrincipal UserAccount me){
    var list = repo.findByUserIdOrderByCreatedAtDesc(me.getId());
    list.forEach(n -> n.setRead(true));
    repo.saveAll(list);
    return ResponseEntity.ok().build();
  }
}
