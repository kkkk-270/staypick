package com.staypick.staypick_back.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.staypick.staypick_back.entity.Room;
import com.staypick.staypick_back.entity.RoomStatus;
import com.staypick.staypick_back.repository.RoomRepository;
import com.staypick.staypick_back.repository.RoomStatusRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomStatusService {

    private final RoomStatusRepository statusRepository;
    private final RoomRepository roomRepository;

    @Transactional
    public RoomStatus updateRoomStatus(Long roomId, LocalDate date, String status){
        Room room = roomRepository.findById(roomId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 객실입니다. id=" + roomId));
        
        Optional<RoomStatus> existingStatusOpt = statusRepository.findByRoomIdAndDate(roomId, date);

        if(existingStatusOpt.isPresent()){
            RoomStatus existingStatus = existingStatusOpt.get();
            existingStatus.setStatus(status);
            return statusRepository.save(existingStatus);
        }else{
            RoomStatus newStatus = RoomStatus.builder()
                .room(room)
                .date(date)
                .status(status)
                .build();
            return statusRepository.save(newStatus);
        }
    }

    public Map<Long, Map<String, String>> getWeeklyRoomStatus(LocalDate start, LocalDate end){
        List<Room> rooms = roomRepository.findAll();
        List<RoomStatus> statusList = statusRepository.findByDateBetween(start, end);

        Map<Long, Map<String, String>> result = new HashMap<>();

        for(RoomStatus rs : statusList){
            Long roomId = rs.getRoom().getId();
            String dateStr = rs.getDate().toString();

            result.computeIfAbsent(roomId, k -> new HashMap<>())
                .put(dateStr, rs.getStatus());
        }

        for(Room room : rooms){
            Long roomId = room.getId();
            Map<String, String> roomMap = result.computeIfAbsent(roomId, k -> new HashMap<>());

            LocalDate current = start;
            while(!current.isAfter(end)){
                String dateStr = current.toString();
                roomMap.putIfAbsent(dateStr, "예약 가능");
                current = current.plusDays(1);
            }
        }
        return result;
    }
}
