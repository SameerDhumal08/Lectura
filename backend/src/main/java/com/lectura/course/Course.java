package com.lectura.course;
import com.lectura.user.UserAccount;
import jakarta.persistence.*;
import java.util.UUID;

@Entity @Table(name="courses")
public class Course {
  @Id @GeneratedValue private UUID id;
  @Column(nullable=false) private String name;
  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="teacher_id") private UserAccount teacher;
  public Course(){} public Course(String name, UserAccount teacher){ this.name=name; this.teacher=teacher; }
  public UUID getId(){return id;} public String getName(){return name;} public UserAccount getTeacher(){return teacher;}
  public void setName(String v){name=v;} public void setTeacher(UserAccount t){teacher=t;}
}
