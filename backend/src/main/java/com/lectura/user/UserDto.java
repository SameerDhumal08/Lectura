package com.lectura.user;
import com.lectura.common.Role;
import java.time.Instant;
import java.util.UUID;
public record UserDto(UUID id, String email, String fullName, Role role, Instant createdAt) {
  public static UserDto of(UserAccount u){ return new UserDto(u.getId(), u.getEmail(), u.getFullName(), u.getRole(), u.getCreatedAt()); }
}
