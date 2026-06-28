package com.lectura.course;
import com.lectura.user.UserAccount;
import com.lectura.user.UserRepository;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/courses")
public class CourseController {
  private final CourseRepository courses; private final EnrollmentRepository enrollments; private final UserRepository users;
  public CourseController(CourseRepository c, EnrollmentRepository e, UserRepository u){ this.courses=c; this.enrollments=e; this.users=u; }

  public record CreateReq(@NotBlank String name, UUID teacherId) {}
  public record EnrollReq(UUID studentId) {}

  @GetMapping
  public List<CourseDto> list(){ return courses.findAll().stream().map(CourseDto::of).toList(); }

  @PostMapping @PreAuthorize("hasAuthority('admin')")
  public CourseDto create(@RequestBody CreateReq r){
    UserAccount teacher = r.teacherId()==null ? null : users.findById(r.teacherId()).orElseThrow(() -> new IllegalArgumentException("Teacher not found"));
    return CourseDto.of(courses.save(new Course(r.name(), teacher)));
  }

  @DeleteMapping("/{id}") @PreAuthorize("hasAuthority('admin')")
  public ResponseEntity<?> delete(@PathVariable UUID id){ courses.deleteById(id); return ResponseEntity.noContent().build(); }

  @GetMapping("/{id}/roster") @PreAuthorize("hasAnyAuthority('admin','teacher')")
  public List<UUID> roster(@PathVariable UUID id){
    Course c = courses.findById(id).orElseThrow(() -> new IllegalArgumentException("Course not found"));
    return enrollments.findByCourse(c).stream().map(e -> e.getStudent().getId()).toList();
  }

  @PostMapping("/{id}/enroll") @PreAuthorize("hasAuthority('admin')")
  public ResponseEntity<?> enroll(@PathVariable UUID id, @RequestBody EnrollReq r){
    Course c = courses.findById(id).orElseThrow(() -> new IllegalArgumentException("Course not found"));
    UserAccount s = users.findById(r.studentId()).orElseThrow(() -> new IllegalArgumentException("Student not found"));
    enrollments.findByCourseAndStudent(c, s).ifPresentOrElse(
      enrollments::delete,
      () -> enrollments.save(new Enrollment(c, s))
    );
    return ResponseEntity.ok().build();
  }
}
