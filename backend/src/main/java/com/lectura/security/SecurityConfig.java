package com.lectura.security;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;
import org.springframework.web.cors.reactive.CorsWebFilter;
import java.util.List;

@Configuration @EnableMethodSecurity
public class SecurityConfig {
  @Value("${app.cors.allowed-origins}") private String allowedOrigins;

  @Bean PasswordEncoder passwordEncoder(){ return new BCryptPasswordEncoder(); }

  @Bean
  SecurityFilterChain chain(HttpSecurity http, JwtFilter jwt) throws Exception {
    http
      .cors(c -> c.configurationSource(corsSource()))
      .csrf(AbstractHttpConfigurer::disable)
      .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(a -> a
        .requestMatchers("/api/auth/**", "/h2/**", "/error").permitAll()
        .anyRequest().authenticated())
      .headers(h -> h.frameOptions(f -> f.sameOrigin())) // allow H2 console
      .addFilterBefore(jwt, UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }

  private CorsConfigurationSource corsSource(){
    var cfg = new CorsConfiguration();
    cfg.setAllowedOrigins(List.of(allowedOrigins.split(",")));
    cfg.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
    cfg.setAllowedHeaders(List.of("*"));
    cfg.setAllowCredentials(true);
    var src = new UrlBasedCorsConfigurationSource();
    src.registerCorsConfiguration("/**", cfg);
    return src;
  }
}
