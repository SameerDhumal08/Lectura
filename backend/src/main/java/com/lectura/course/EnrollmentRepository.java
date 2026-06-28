package com.lectura.course;
import com.lectura.user.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {
  List<Enrollment> findByCourse(Course course);
  List<Enrollment> findByStudent(UserAccount student);
  Optional<Enrollment> findByCourseAndStudent(Course course, UserAccount student);
}
