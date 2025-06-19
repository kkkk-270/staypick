package com.staypick.staypick_back.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.staypick.staypick_back.dto.DiscountWithRoomSeasonDTO;
import com.staypick.staypick_back.entity.Room;
import com.staypick.staypick_back.entity.RoomDiscount;

public interface RoomDiscountRepository extends JpaRepository<RoomDiscount, Long> {
    List<RoomDiscount> findByRoomId(Long roomId);
    List<RoomDiscount> findByRoom(Room room);

    @Query(value = """
        SELECT
            d.id AS discount_id,
            r.id AS room_id,
            r.name AS room_name,
            r.price,
            r.weekend_price AS weekendPrice,
            r.peak_price AS peakPrice,
            d.period_name AS periodName,
            d.start_date AS startDate,
            d.end_date AS endDate,
            d.discount_type AS discountType,
            d.discount_value AS discountValue,
            (
                SELECT s.type
                FROM season s
                WHERE s.accommodation_id = r.accommodation_id
                AND d.start_date BETWEEN s.start_date AND s.end_date
                ORDER BY s.start_date DESC
                LIMIT 1
            ) AS season_type
        FROM room_discount d
        JOIN room r ON d.room_id = r.id
        WHERE r.accommodation_id = :accId
    """, nativeQuery = true)
    List<DiscountWithRoomSeasonDTO> findDicountsWithRoomAndSeason(@Param("accId") Long accId);
}
