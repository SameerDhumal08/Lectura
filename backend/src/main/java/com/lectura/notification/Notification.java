package com.lectura.notification;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="notifications")
public class Notification {
  @Id @GeneratedValue private UUID id;
  @Column(nullable=false) private UUID userId;
  @Column(nullable=false) private String title;
  @Column(length=1000) private String body;
  private String link;
  @Column(nullable=false) private boolean isRead = false;
  @Column(nullable=false) private Instant createdAt;

  public Notification(){} public Notification(UUID userId, String title, String body, String link, Instant createdAt){
    this.userId=userId; this.title=title; this.body=body; this.link=link; this.createdAt=createdAt;
  }
  public UUID getId(){return id;} public UUID getUserId(){return userId;} public String getTitle(){return title;}
  public String getBody(){return body;} public String getLink(){return link;} public boolean isRead(){return isRead;}
  public Instant getCreatedAt(){return createdAt;}
  public void setRead(boolean v){isRead=v;}
}
