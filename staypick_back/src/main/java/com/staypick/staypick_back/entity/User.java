package com.staypick.staypick_back.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userid;
    private String password;
    private String username;
    private String tel;
    private String email;
    private LocalDateTime birth;
    private LocalDateTime regdate;
    private String userip;

    @Column(nullable = false)
    private String role;

    private String provider;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Reservation> reservations;

    // 생성자 방식: Builder 또는 정적 팩토리 메서드 모두 제공
    @Builder
    public User(String userid, String password, String username,
                String tel, String email, LocalDateTime birth,
                String userip, String provider, String role) {
        this.userid = userid;
        this.password = password;
        this.username = username;
        this.tel = tel;
        this.email = email;
        this.birth = birth;
        this.userip = userip;
        this.provider = provider;
        this.role = (role != null) ? role : "USER";
        this.regdate = LocalDateTime.now();
    }

    public static User createUser(String userid, String password, String username,
                                  String tel, String email, LocalDateTime birth,
                                  String userip, String provider, String role) {
        return new User(userid, password, username, tel, email, birth, userip, provider, role);
    }

    // 회원 정보 추가 입력 시 사용
    public void updateAdditionalInfo(String password, String tel, String email,
                                     LocalDateTime birth, String userip) {
        this.password = password;
        this.tel = tel;
        this.email = email;
        this.birth = birth;
        this.userip = userip;
    }

    @Override
    public String toString() {
        return "User(userid=" + userid + ", username=" + username + ")";
    }
}
