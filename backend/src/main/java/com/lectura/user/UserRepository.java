package com.lectura.user;
import com.lectura.common.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface UserRepository extends JpaRepository<UserAccount, UUID> {
  Optional<UserAccount> findByEmailIgnoreCase(String email);
  List<UserAccount> findByRole(Role role);
  boolean existsByEmailIgnoreCase(String email);
}
