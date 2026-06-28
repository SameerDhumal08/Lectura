package com.lectura.auth;
import com.lectura.common.Role;
import com.lectura.security.JwtService;
import com.lectura.user.*;
import jakarta.validation.constraints.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController @RequestMapping("/api/auth")
public class AuthController {
  private final UserRepository users; private final PasswordEncoder enc; private final JwtService jwt;
  public AuthController(UserRepository u, PasswordEncoder e, JwtService j){ this.users=u; this.enc=e; this.jwt=j; }

  public record LoginReq(@Email String email, @NotBlank String password) {}
  public record SignupReq(@Email String email, @NotBlank String fullName, @Size(min=8) String password) {}

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginReq r){
    var u = users.findByEmailIgnoreCase(r.email()).orElse(null);
    if (u == null || !enc.matches(r.password(), u.getPasswordHash()))
      return ResponseEntity.status(401).body(Map.of("error","Invalid credentials"));
    return ResponseEntity.ok(Map.of(
      "token", jwt.issue(u.getId(), u.getRole().name()),
      "user", UserDto.of(u)));
  }

  @PostMapping("/signup")
  public ResponseEntity<?> signup(@RequestBody SignupReq r){
    if (users.existsByEmailIgnoreCase(r.email()))
      return ResponseEntity.status(409).body(Map.of("error","Email already in use"));
    var u = users.save(new UserAccount(r.email().toLowerCase(), r.fullName(), enc.encode(r.password()), Role.student));
    return ResponseEntity.ok(Map.of(
      "token", jwt.issue(u.getId(), u.getRole().name()),
      "user", UserDto.of(u)));
  }
}
