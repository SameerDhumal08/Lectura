package com.lectura.security;
import com.lectura.user.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {
  private final JwtService jwt; private final UserRepository users;
  public JwtFilter(JwtService j, UserRepository u){ this.jwt=j; this.users=u; }

  @Override protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
      throws ServletException, IOException {
    String h = req.getHeader("Authorization");
    if (h != null && h.startsWith("Bearer ")) {
      try {
        var uid = jwt.parseUserId(h.substring(7));
        users.findById(uid).ifPresent(u -> {
          var auth = new UsernamePasswordAuthenticationToken(u, null,
            List.of(new SimpleGrantedAuthority(u.getRole().name())));
          SecurityContextHolder.getContext().setAuthentication(auth);
        });
      } catch (Exception ignored) {}
    }
    chain.doFilter(req, res);
  }
}
