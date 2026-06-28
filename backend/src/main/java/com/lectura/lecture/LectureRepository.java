package com.lectura.lecture;
import com.lectura.course.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface LectureRepository extends JpaRepository<Lecture, UUID> {
  List<Lecture> findByCourseIn(Collection<Course> courses);
}
