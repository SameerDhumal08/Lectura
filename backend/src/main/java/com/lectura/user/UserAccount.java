package com.lectura.user;
import com.lectura.common.Role;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="users", uniqueConstraints=@UniqueConstraint(columnNames="email"))
public class UserAccount {
  @Id @GeneratedValue private UUID id;
  @Column(nullable=false, unique=true) private String email;
  @Column(nullable=false) private String fullName;
  @Column(nullable=false) private String passwordHash;
  @Enumerated(EnumType.STRING) @Column(nullable=false) private Role role;
  @Column(nullable=false, updatable=false) private Instant createdAt = Instant.now();

  public UserAccount() {}
  public UserAccount(String email, String fullName, String passwordHash, Role role) {
    this.email=email; this.fullName=fullName; this.passwordHash=passwordHash; this.role=role;
  }
  public UUID getId(){return id;} public String getEmail(){return email;} public String getFullName(){return fullName;}
  public String getPasswordHash(){return passwordHash;} public Role getRole(){return role;} public Instant getCreatedAt(){return createdAt;}
  public void setEmail(String v){email=v;} public void setFullName(String v){fullName=v;}
  public void setPasswordHash(String v){passwordHash=v;} public void setRole(Role v){role=v;}
}
