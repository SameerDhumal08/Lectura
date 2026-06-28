package com.lectura.course;
import com.lectura.user.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface CourseRepository extends JpaRepository<Course, UUID> {
  List<Course> findByTeacher(UserAccount teacher);
}
