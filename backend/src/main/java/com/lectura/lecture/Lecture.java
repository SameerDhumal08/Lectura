package com.lectura.lecture;
import com.lectura.course.Course;
import jakarta.persistence.*;
import java.time.LocalTime;
import java.util.UUID;

@Entity @Table(name="lectures")
public class Lecture {
  @Id @GeneratedValue private UUID id;
  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="course_id", nullable=false) private Course course;
  @Column(nullable=false) private String title;
  @Column(nullable=false) private int dayOfWeek;
  @Column(nullable=false) private LocalTime startTime;
  @Column(nullable=false) private LocalTime endTime;
  @Column(nullable=false) private String meetUrl;

  public Lecture(){} public Lecture(Course c, String title, int dow, LocalTime s, LocalTime e, String meet){
    this.course=c; this.title=title; this.dayOfWeek=dow; this.startTime=s; this.endTime=e; this.meetUrl=meet;
  }
  public UUID getId(){return id;} public Course getCourse(){return course;} public String getTitle(){return title;}
  public int getDayOfWeek(){return dayOfWeek;} public LocalTime getStartTime(){return startTime;}
  public LocalTime getEndTime(){return endTime;} public String getMeetUrl(){return meetUrl;}
}
