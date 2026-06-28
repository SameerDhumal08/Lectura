package com.lectura.course;
import java.util.UUID;
public record CourseDto(UUID id, String name, UUID teacherId, String teacherName) {
  public static CourseDto of(Course c){
    return new CourseDto(c.getId(), c.getName(),
      c.getTeacher()==null?null:c.getTeacher().getId(),
      c.getTeacher()==null?null:c.getTeacher().getFullName());
  }
}
