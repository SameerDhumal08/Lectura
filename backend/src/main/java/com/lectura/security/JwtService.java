package com.lectura.security;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {
  private final SecretKey key; private final long expirationMs;
  public JwtService(@Value("${app.jwt.secret}") String secret, @Value("${app.jwt.expiration-ms}") long exp){
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.expirationMs = exp;
  }
  public String issue(UUID userId, String role){
    Date now = new Date();
    return Jwts.builder()
      .subject(userId.toString())
      .claim("role", role)
      .issuedAt(now)
      .expiration(new Date(now.getTime() + expirationMs))
      .signWith(key).compact();
  }
  public UUID parseUserId(String token){
    var claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    return UUID.fromString(claims.getSubject());
  }
}
