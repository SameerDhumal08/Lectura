package com.lectura.lecture;
import java.time.LocalTime;
import java.util.UUID;
public record LectureDto(UUID id, UUID courseId, String courseName, String title,
                         int dayOfWeek, LocalTime startTime, LocalTime endTime, String meetUrl) {
  public static LectureDto of(Lecture l){
    return new LectureDto(l.getId(), l.getCourse().getId(), l.getCourse().getName(),
      l.getTitle(), l.getDayOfWeek(), l.getStartTime(), l.getEndTime(), l.getMeetUrl());
  }
}
