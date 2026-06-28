package com.lectura.lecture;
import com.lectura.common.Role;
import com.lectura.course.*;
import com.lectura.notification.*;
import com.lectura.user.UserAccount;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalTime;
import java.util.*;

@RestController @RequestMapping("/api/lectures")
public class LectureController {
  private static final String[] DAYS = {"Sun","Mon","Tue","Wed","Thu","Fri","Sat"};
  private final LectureRepository lectures; private final CourseRepository courses;
  private final EnrollmentRepository enrollments; private final NotificationRepository notifications;
  public LectureController(LectureRepository l, CourseRepository c, EnrollmentRepository e, NotificationRepository n){
    this.lectures=l; this.courses=c; this.enrollments=e; this.notifications=n;
  }

  public record CreateReq(UUID courseId, @NotBlank String title, int dayOfWeek, LocalTime startTime, LocalTime endTime) {}

  @GetMapping
  public List<LectureDto> mine(@AuthenticationPrincipal UserAccount me){
    Collection<Course> mine;
    if (me.getRole()==Role.admin) mine = courses.findAll();
    else if (me.getRole()==Role.teacher) mine = courses.findByTeacher(me);
    else mine = enrollments.findByStudent(me).stream().map(Enrollment::getCourse).toList();
    if (mine.isEmpty()) return List.of();
    return lectures.findByCourseIn(mine).stream()
      .sorted(Comparator.comparingInt(Lecture::getDayOfWeek).thenComparing(Lecture::getStartTime))
      .map(LectureDto::of).toList();
  }

  @PostMapping @PreAuthorize("hasAuthority('admin')")
  public LectureDto create(@RequestBody CreateReq r){
    if (r.dayOfWeek()<0 || r.dayOfWeek()>6) throw new IllegalArgumentException("dayOfWeek 0-6");
    if (!r.startTime().isBefore(r.endTime())) throw new IllegalArgumentException("startTime must precede endTime");
    Course c = courses.findById(r.courseId()).orElseThrow(() -> new IllegalArgumentException("Course not found"));
    Lecture l = lectures.save(new Lecture(c, r.title(), r.dayOfWeek(), r.startTime(), r.endTime(), meetLink()));

    // Notification fan-out: teacher + enrolled students
    Set<UUID> recipients = new HashSet<>();
    if (c.getTeacher()!=null) recipients.add(c.getTeacher().getId());
    enrollments.findByCourse(c).forEach(e -> recipients.add(e.getStudent().getId()));
    String when = DAYS[l.getDayOfWeek()] + " " + l.getStartTime() + "–" + l.getEndTime();
    var notifs = recipients.stream().map(uid -> new Notification(
      uid, "New lecture: " + l.getTitle(), c.getName() + " • " + when, l.getMeetUrl(), Instant.now()
    )).toList();
    notifications.saveAll(notifs);
    return LectureDto.of(l);
  }

  @DeleteMapping("/{id}") @PreAuthorize("hasAuthority('admin')")
  public ResponseEntity<?> delete(@PathVariable UUID id){ lectures.deleteById(id); return ResponseEntity.noContent().build(); }

  private static String meetLink(){
    SecureRandom r = new SecureRandom();
    return "https://meet.google.com/" + seg(r,3) + "-" + seg(r,4) + "-" + seg(r,3);
  }
  private static String seg(SecureRandom r, int n){
    StringBuilder sb = new StringBuilder();
    for (int i=0;i<n;i++) sb.append((char)('a' + r.nextInt(26)));
    return sb.toString();
  }
}
