package com.staypick.staypick_back.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "biz_accommodation")
@Data
@NoArgsConstructor
public class BizAccommodation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "acc_id", nullable = false)
    private Accommodation accommodation;

    public BizAccommodation(User user, Accommodation accommodation){
        if(!"ADMIN".equals(user.getRole())){
            throw new IllegalArgumentException("Only users with role ADMIN can register accommodations.");
        }
        this.user = user;
        this.accommodation = accommodation;
    }
}
