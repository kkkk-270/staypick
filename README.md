
# 🏨 숙박 예약 플랫폼 StayPick 

> 사용자를 위한 간편한 숙소 예약 시스템과  
> 관리자/사업자를 위한 통합 숙소 관리 기능을 제공하는 웹 기반 숙박 예약 플랫폼입니다.

---

## 👥 팀원 역할 소개

| 이름 | 역할 | GitHub |
|------|------|--------|
| 서동현 (팀장) | 백엔드 전반 설계 및 사용자 기능 API 구축 | [@ca1yp2](https://github.com/ca1yp2) |
| 김진재 | 프론트엔드 전체 / 관리자 시스템 / Toss 연동 / 배포 구성 | [@kkkk-270](https://github.com/kkkk-270) |
| 주현우 | 프론트엔드 보조, 정적 데이터 구성 및 테스트 지원 | [@joohw1](https://github.com/joohw1) |

---

## 👤 담당 역할 - 김진재

| 역할 구분 | 세부 내용 |
|-----------|-----------|
| **프론트엔드** | 전체 사용자 페이지 및 관리자 페이지 UI 개발<br/>컴포넌트 구조 설계, React 상태 관리, 달력/모달 등 주요 기능 구현<br/>마이페이지(예약, 리뷰, 정보 수정), 관리자 대시보드, 요금 관리, 문의/리뷰 관리 화면 등 직접 구현 |
| **백엔드** | JWT 기반 인증 및 사용자 정보 처리<br/>예약/결제/리뷰/문의 도메인 중심 API 일부 구현<br/>Toss Payments 연동 구조 설계 및 데이터 저장 흐름 구성 |
| **배포 환경 구성** | AWS EC2, RDS, S3 설정<br/>Nginx 리버스 프록시 및 정적 자원 분리<br/>SSL 인증서 적용, S3 이미지 연동 및 운영 환경 구성 |

---

## ⚙️ 개발 환경 요약

### 🖥️ Frontend - React (SPA 구조)
- 컴포넌트 단위 UI 설계 및 상태 관리
- React Router 기반 SPA 구조 구축
- axios 기반 비동기 통신 및 사용자 흐름 구현

### 🖥️ Backend - Spring Boot (REST API)
- JWT 인증 기반 로그인 시스템 구축
- 예약, 리뷰, 결제 등 API 설계 및 일부 기능 구현
- Toss Payments API REST 방식 연동 구조 구성

### 🗃️ Database - MySQL + JPA
- ERD 설계 및 엔티티 관계 구성
- JPA 기반 예약/리뷰/회원 도메인 매핑 및 Repository 구현

### ☁️ 운영환경 - AWS + Nginx
- EC2에 백엔드 배포, 프론트는 정적 자원으로 빌드하여 배포
- RDS(MySQL), S3(리뷰 이미지) 연동 및 운영
- Nginx로 정적/동적 자원 분기 처리 및 HTTPS 설정 적용

---

## 📌 주요 구현 기능 (김진재 파트 기준)

### ✅ 사용자 측 UI 기능
- 로그인/회원가입/비밀번호 재설정 (소셜 + 이메일 기반)
- 숙소 검색, 예약 정보 전달 및 페이지 연동
- 결제 흐름 구성 (Payment → Checkout → Success)
- 마이페이지 (예약 내역 / 리뷰 작성·조회 / 회원 정보 수정)

### ✅ 관리자 시스템 기능
- 객실 및 요금 정보 관리 (기본/주말/성수기/할인)
- 시즌·성수기·주말 자동 등록 UI 개발
- 리뷰 및 문의 관리 화면 및 답변 처리 기능 구현
- 관리자 예약 현황 달력, 대시보드 차트 등 UI 직접 구성

### ✅ Toss 결제 연동 (REST API 방식)
- 결제 준비 → 승인 → 예약 저장까지 전체 흐름 설계 및 프론트 연동 구현
- 프론트에서 예약 정보 상태 유지 및 성공 처리 후 상태 반영 처리 담당

---

## 📁 주요 폴더 구조 (참여 중심 위주)

```bash
staypick_front/
├── components/        # 공통 컴포넌트 (Modal, DatePicker 등)
├── pages/             # 사용자 페이지 (홈, 숙소, 마이페이지 등)
├── admin/pages/       # 관리자 전용 페이지
├── admin/components/  # 관리자 기능별 UI 컴포넌트
├── api/               # Axios 인스턴스 및 API 함수 관리
├── routes/            # React Router 설정
├── css/               # 스타일 파일
└── main.jsx           # 진입점

staypick_back/
├── controller/api/    # 사용자/관리자 API 컨트롤러
├── dto/               # 요청/응답 DTO
├── entity/            # JPA 엔티티
├── repository/        # JPA 리포지토리
├── service/           # 비즈니스 로직
├── security/          # JWT 기반 보안 구성
└── util/              # 유틸 클래스
```

---

## 🚀 실행 방법

### 1. 프론트엔드 환경 변수 (`.env`)
```env
VITE_KAKAO_KEY=카카오 api 키
VITE_NAVER_CLIENT_ID=네이버 client ID
VITE_NAVER_REDIRECT_URI=http://localhost:5173/login
VITE_NAVER_CLIENT_SECRET=네이버 secret
VITE_TOSS_CLIENT_KEY=토스 테스트 키
```

### 2. 백엔드 설정 (`application.yml`)
```yaml
server:
  port: 8081

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/staypick
    username: [DB 유저명]
    password: [DB 비밀번호]
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
```

### 3. 실행 순서

1. `staypick_back` → StaypickBackApplication 실행 (백엔드)
2. `staypick_front` → `npm run dev` 또는 `yarn dev` 실행 (프론트)

### 4. 접속 URL
- 프론트엔드: http://localhost:5173
- 백엔드 API: http://localhost:8081

---

## 🛠️ 향후 개발 예정 기능

- 모바일 반응형 UI 개선
- 관리자 숙소별 예약 통계 시각화 강화
- 사업자 전용 회원가입 페이지 추가
- 숙소 추천 알고리즘 적용 (리뷰 기반)
- 다국어 다중 언어 지원 (i18n)
- 관리자 페이지 이미지 관리 기능 보강
- 마이페이지 회원 탈퇴 및 로그인 기록 표시
- 결제 실패 / 중단 시 UX 개선 흐름 처리

---

## 📮 문의

- GitHub: [github.com/kkkk-270](https://github.com/kkkk-270)
- 이메일: jinjaegim60@gmail.com

---

## 📄 라이선스

MIT 라이선스 (MIT License)

본 프로젝트는 학습 및 팀 프로젝트 포트폴리오 용도로 제작되었습니다.  
상업적 이용은 제한될 수 있으며, 소스코드는 자유롭게 참고하실 수 있습니다.

> 본 저장소는 김진재 개인 작업 중심의 내용을 정리한 포트폴리오용 Fork 버전입니다.
