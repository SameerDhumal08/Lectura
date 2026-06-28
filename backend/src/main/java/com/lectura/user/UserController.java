package com.lectura.user;
import com.lectura.common.Role;
import jakarta.validation.constraints.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/users")
public class UserController {
  private final UserRepository users; private final PasswordEncoder enc;
  public UserController(UserRepository u, PasswordEncoder e){ this.users=u; this.enc=e; }

  public record CreateReq(@Email String email, @NotBlank String fullName, @Size(min=8) String password, Role role) {}
  public record RoleReq(Role role) {}

  @GetMapping
  @PreAuthorize("hasAuthority('admin')")
  public List<UserDto> list(@RequestParam(required=false) Role role){
    return (role==null ? users.findAll() : users.findByRole(role)).stream().map(UserDto::of).toList();
  }

  @PostMapping
  @PreAuthorize("hasAuthority('admin')")
  public UserDto create(@RequestBody CreateReq r){
    if (users.existsByEmailIgnoreCase(r.email())) throw new IllegalStateException("Email already in use");
    if (r.role()==Role.admin) throw new IllegalArgumentException("Promote to admin via /api/users/{id}/role");
    var u = new UserAccount(r.email().toLowerCase(), r.fullName(), enc.encode(r.password()), r.role());
    return UserDto.of(users.save(u));
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAuthority('admin')")
  public ResponseEntity<?> delete(@PathVariable UUID id, @AuthenticationPrincipal UserAccount me){
    if (me.getId().equals(id)) throw new IllegalArgumentException("You cannot delete yourself");
    users.deleteById(id);
    return ResponseEntity.noContent().build();
  }

  @PutMapping("/{id}/role")
  @PreAuthorize("hasAuthority('admin')")
  public UserDto setRole(@PathVariable UUID id, @RequestBody RoleReq r, @AuthenticationPrincipal UserAccount me){
    if (me.getId().equals(id) && r.role()!=Role.admin) throw new IllegalArgumentException("Cannot demote yourself");
    var u = users.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
    u.setRole(r.role()); return UserDto.of(users.save(u));
  }

  @GetMapping("/me")
  public UserDto me(@AuthenticationPrincipal UserAccount me){
    if (me==null) throw new AccessDeniedException("anon");
    return UserDto.of(me);
  }
}
