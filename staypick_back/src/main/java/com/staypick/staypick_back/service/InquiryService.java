package com.staypick.staypick_back.service;

import com.staypick.staypick_back.dto.InquiryRequest;
import com.staypick.staypick_back.dto.InquiryResponse;
import com.staypick.staypick_back.entity.Accommodation;
import com.staypick.staypick_back.entity.Inquiry;
import com.staypick.staypick_back.entity.User;
import com.staypick.staypick_back.repository.AccommodationRepository;
import com.staypick.staypick_back.repository.InquiryRepository;
import com.staypick.staypick_back.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final UserRepository userRepository;
    private final AccommodationRepository accommodationRepository;

    public void createInquiry(String userId, InquiryRequest request) {
        if (request.getAccommodationId() == null) {
                throw new IllegalArgumentException("숙소 ID는 필수입니다.");
        }

        User user = userRepository.findByUserid(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));
        Accommodation accommodation = accommodationRepository.findById(request.getAccommodationId())
                .orElseThrow(() -> new IllegalArgumentException("숙소가 존재하지 않습니다."));

        Inquiry inquiry = Inquiry.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .inquiryType(request.getInquiryType())
                .status("processing")
                .createdAt(LocalDateTime.now())
                .user(user)
                .accommodation(accommodation)
                .build();

        inquiryRepository.save(inquiry);
    }

    public List<InquiryResponse> getInquiriesByUser(String userId) {
        return inquiryRepository.findByUserUserid(userId).stream()
                .map(InquiryResponse::from)
                .collect(Collectors.toList());
    }

    public List<InquiryResponse> getAllInquiries() {
    return inquiryRepository.findAll().stream()  // ✅ 메서드명 변경
            .map(InquiryResponse::from)
            .collect(Collectors.toList());
}
    public void addCommentToInquiry(Long id, String comment) {
        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 문의가 존재하지 않습니다."));
        inquiry.setComment(comment);
        inquiry.setStatus("completed");
        inquiryRepository.save(inquiry);
    }
}
