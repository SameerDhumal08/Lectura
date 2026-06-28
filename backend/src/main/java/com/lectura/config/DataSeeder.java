package com.lectura.config;
import com.lectura.common.Role;
import com.lectura.course.*;
import com.lectura.lecture.*;
import com.lectura.user.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalTime;

@Component
public class DataSeeder implements CommandLineRunner {
  private final UserRepository users; private final CourseRepository courses;
  private final EnrollmentRepository enrollments; private final LectureRepository lectures;
  private final PasswordEncoder enc;

  public DataSeeder(UserRepository u, CourseRepository c, EnrollmentRepository e, LectureRepository l, PasswordEncoder pe){
    this.users=u; this.courses=c; this.enrollments=e; this.lectures=l; this.enc=pe;
  }

  @Override public void run(String... args) {
    if (users.count() > 0) return;
    var admin   = users.save(new UserAccount("admin@lectura.dev",   "Ada Admin",    enc.encode("password"), Role.admin));
    var teacher = users.save(new UserAccount("teacher@lectura.dev", "Tina Teacher", enc.encode("password"), Role.teacher));
    var student = users.save(new UserAccount("student@lectura.dev", "Sam Student",  enc.encode("password"), Role.student));
    var algo = courses.save(new Course("Intro to Algorithms", teacher));
    enrollments.save(new Enrollment(algo, student));
    lectures.save(new Lecture(algo, "Big-O & Asymptotics", 1, LocalTime.of(9,0),  LocalTime.of(10,0),  "https://meet.google.com/abc-defg-hij"));
    lectures.save(new Lecture(algo, "Sorting Lab",         3, LocalTime.of(11,0), LocalTime.of(12,30), "https://meet.google.com/xyz-pqrs-tuv"));
    System.out.println("[seed] demo users ready: admin/teacher/student @lectura.dev (password: password)");
  }
}
