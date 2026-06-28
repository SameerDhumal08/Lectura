package com.lectura.common;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.ConstraintViolationException;
import java.util.Map;

@RestControllerAdvice
public class ApiError {
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<?> bad(IllegalArgumentException e){ return ResponseEntity.badRequest().body(Map.of("error", e.getMessage())); }
  @ExceptionHandler(IllegalStateException.class)
  public ResponseEntity<?> conflict(IllegalStateException e){ return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage())); }
  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<?> forbidden(AccessDeniedException e){ return ResponseEntity.status(403).body(Map.of("error","Forbidden")); }
  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<?> validation(ConstraintViolationException e){ return ResponseEntity.badRequest().body(Map.of("error", e.getMessage())); }
}
