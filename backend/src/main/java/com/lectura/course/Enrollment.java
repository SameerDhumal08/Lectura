package com.lectura.course;
import com.lectura.user.UserAccount;
import jakarta.persistence.*;
import java.util.UUID;

@Entity @Table(name="enrollments", uniqueConstraints=@UniqueConstraint(columnNames={"course_id","student_id"}))
public class Enrollment {
  @Id @GeneratedValue private UUID id;
  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="course_id", nullable=false) private Course course;
  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="student_id", nullable=false) private UserAccount student;
  public Enrollment(){} public Enrollment(Course c, UserAccount s){ this.course=c; this.student=s; }
  public UUID getId(){return id;} public Course getCourse(){return course;} public UserAccount getStudent(){return student;}
}
