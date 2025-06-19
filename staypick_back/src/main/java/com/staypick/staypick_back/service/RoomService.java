package com.staypick.staypick_back.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.staypick.staypick_back.dto.DiscountWithRoomSeasonDTO;
import com.staypick.staypick_back.dto.RoomDiscountCreateRequest;
import com.staypick.staypick_back.dto.RoomDiscountDTO;
import com.staypick.staypick_back.dto.RoomDiscountUpdateRequest;
import com.staypick.staypick_back.dto.RoomPriceUpdateRequest;
import com.staypick.staypick_back.dto.RoomResponseDTO;
import com.staypick.staypick_back.dto.RoomUpdateRequest;
import com.staypick.staypick_back.entity.Room;
import com.staypick.staypick_back.entity.RoomDiscount;
import com.staypick.staypick_back.repository.RoomDiscountRepository;
import com.staypick.staypick_back.repository.RoomRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomDiscountRepository discountRepository;

    //객실 리스트 조회
    public List<RoomResponseDTO> getRoomsByAccommodationId(Long accommodationId) {
        return roomRepository.findByAccommodationId(accommodationId).stream()
                .map(RoomResponseDTO::new)
                .collect(Collectors.toList());
    }

    //객실 가격 업데이트
    @Transactional
    public void updateRoomPrice(RoomPriceUpdateRequest dto){
        Room room = roomRepository.findById(dto.getRoomId())
            .orElseThrow(() -> new RuntimeException("해당 객실을 찾을 수 없습니다."));
        
        room.setPrice(dto.getBasePrice());
        room.setWeekendPrice(dto.getWeekendPrice());
        room.setPeakPrice(dto.getPeakPrice());
    }

    //객실 정보 업데이트
    @Transactional
    public void updateRoomInfo(RoomUpdateRequest request){
        if (request.getRoomIds().size() != request.getRoomNumbers().size()) {
            throw new IllegalArgumentException("roomIds와 roomNumbers 수가 일치하지 않습니다.");
        }

        List<Room> rooms = roomRepository.findAllById(request.getRoomIds());

        for (int i = 0; i < rooms.size(); i++) {
            Room room = rooms.get(i);

            // originalRoomType과 실제 DB의 값이 일치하는 경우에만 업데이트
            if (!room.getName().equals(request.getOriginalGroupType())) {
                throw new IllegalStateException("Room ID " + room.getId() + "의 name이 요청한 originalGroupType과 일치하지 않습니다.");
            }

            room.setRoomType(request.getNewRoomType());
            room.setRoomNumber(request.getRoomNumbers().get(i));
            room.setPersonnel(request.getPersonnel());
            room.setExtra(request.getExtra());
        }

        roomRepository.saveAll(rooms);
    }

    //기간 할인 업데이트
    @Transactional
    public void updateRoomDiscount(RoomDiscountUpdateRequest request){
        RoomDiscount discount = discountRepository.findById(request.getId())
            .orElseThrow(() -> new RuntimeException("해당 할인 정보를 찾을 수 없습니다."));

        discount.setDiscountType(request.getDiscountType());
        discount.setDiscountValue(request.getDiscountValue());
        discount.setPeriodName(request.getPeriodName());
        discount.setStartDate(request.getStartDate());
        discount.setEndDate(request.getEndDate());

        discountRepository.save(discount);
    }

    //객실의 모든 할인 정보 조회(숙소별)
    public List<RoomDiscountDTO> getRoomDiscountsByAccommodationId(Long accId){
        List<Room> rooms = roomRepository.findByAccommodationId(accId);
        List<RoomDiscountDTO> discountDTOs = new ArrayList<>();

        for(Room room : rooms){
            List<RoomDiscount> discounts = discountRepository.findByRoom(room);
            for(RoomDiscount discount: discounts){
                discountDTOs.add(RoomDiscountDTO.builder()
                    .id(discount.getId())
                    .roomId(room.getId())
                    .discountType(discount.getDiscountType())
                    .discountValue(discount.getDiscountValue())
                    .periodName(discount.getPeriodName())
                    .startDate(discount.getStartDate())
                    .endDate(discount.getEndDate())
                    .build());
            }
        }
        return discountDTOs;
    }

    //기간 할인 추가
    @Transactional
    public RoomDiscountDTO addRoomDiscount(RoomDiscountCreateRequest request){
        Room room = roomRepository.findById(request.getRoomId())
            .orElseThrow(() -> new RuntimeException("해당 객실을 찾을 수 없습니다."));

        RoomDiscount discount = RoomDiscount.builder()
            .room(room)
            .discountType(request.getDiscountType())
            .discountValue(request.getDiscountValue())
            .periodName(request.getPeriodName())
            .startDate(request.getStartDate())
            .endDate(request.getEndDate())
            .build();
        RoomDiscount saved = discountRepository.save(discount);

        return RoomDiscountDTO.builder()
            .id(saved.getId())
            .roomId(saved.getRoom().getId())
            .discountType(saved.getDiscountType())
            .discountValue(saved.getDiscountValue())
            .periodName(saved.getPeriodName())
            .startDate(saved.getStartDate())
            .endDate(saved.getEndDate())
            .build();
    }

    //기간 할인 삭제
    @Transactional
    public void deleteRoomDiscount(Long discountId){
        if(!discountRepository.existsById(discountId)){
            throw new RuntimeException("해당 할인 정보가 존재하지 않습니다.");
        }
        discountRepository.deleteById(discountId);
    }

    public List<DiscountWithRoomSeasonDTO> getDiscountWithRoomAndSeason(Long accId){
        return discountRepository.findDicountsWithRoomAndSeason(accId);
    }
}
