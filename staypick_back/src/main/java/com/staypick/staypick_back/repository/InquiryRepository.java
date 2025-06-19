package com.staypick.staypick_back.repository;

import com.staypick.staypick_back.entity.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import java.util.List;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {

    List<Inquiry> findByUserId(Long userId);
    List<Inquiry> findByUserUserid(String userid);

    @EntityGraph(attributePaths = {"user", "accommodation"})
    List<Inquiry> findAll();  // 💡 메서드 이름 수정: Spring이 이해 가능한 이름으로
}
