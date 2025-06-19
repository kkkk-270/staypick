# 🏨 숙박 예약 플랫폼 StayPick

> 사용자를 위한 간편한 숙소 예약 시스템과  
> 관리자/사업자를 위한 통합 숙소 관리 기능을 제공하는 웹 기반 숙박 예약 플랫폼입니다.

---

## 👥 팀원 소개

| 이름     | 역할             | GitHub                                 | 이메일                  |
|----------|------------------|-----------------------------------------|--------------------------|
| 서동현   | 팀장 / 프론트 및 백엔드 개발 | [@ca1yp2-dev](https://github.com/ca1yp2) | seodh2706@gmail.com      |
| 김진재   | 프론트엔드 및 백엔드 개발, 사이트 배포  | [@kkkk-270-dev](https://github.com/kkkk-270)  | jin567656@naver.com        |
| 주현우  | 프론트엔드 개발, 정적 데이터 처리   | [@joohw1-dev](https://github.com/joohw1)   | hyonu08@gmail.com     |


## 📌 주요 기능

### ✅ 사용자 기능
- 소셜 로그인 (카카오, 네이버, 구글 OAuth 연동)
- 숙소 검색 및 상세 필터링
- 실시간 객실 예약 및 결제 (토스페이먼츠 SDK 연동)
- 예약 내역 조회, 수정 및 취소
- 리뷰 작성, 조회 및 이미지 업로드
- 비밀번호 찾기 및 재설정 (이메일 인증 기반)
- 개인 정보 수정 및 회원 정보 관리

### ✅ 사업자 및 관리자 기능
- 숙소 등록, 수정
- 객실 및 요금(기본/주말/성수기/할인) 정보 관리
- 시즌별 할인 정책 설정 및 기간 관리
- 예약 현황 실시간 모니터링 및 관리
- 고객 문의 및 리뷰 관리

---

## 📦 결제 API 연동 구조 (Toss Payments)

StayPick은 Toss Payments와의 연동에서 **REST API 방식**을 채택하여,  
**결제 흐름의 제어권 확보**, **보안성 강화**, **매끄러운 UX 제공**을 동시에 달성하였습니다.

### 🔐 구조적 특징

| 항목                     | 설명 |
|--------------------------|------|
| **연동 방식**              | Toss Widget이 아닌, REST API 기반 자체 연동 방식 |
| **결제 준비 API**         | `POST /api/payments/ready` → Toss 본사 `/v1/payments` 호출 |
| **결제 승인 API**         | `POST /api/payments/success` → Toss 본사 `/v1/payments/confirm` |
| **Secret Key 보안 처리**   | 모든 결제 API는 백엔드에서만 호출하여 Secret Key 노출 없음 |
| **UX 흐름**               | 사용자: Toss 결제창만 경험 / 시스템: 백엔드에서 예약 저장 및 응답 |

---

### 🧩 결제 흐름 상세 다이어그램

1. 사용자 (Payment.jsx)
   └── 예약 정보 입력 후 [결제하기] 클릭
         ↓
2. 백엔드 (/api/payments/ready)
   └── Toss 결제 준비 API 호출 → 결제창 URL 응답
         ↓
3. 프론트 (TossCheckout.jsx)
   └── 결제창으로 리다이렉트 → 카드 정보 입력
         ↓
4. Toss (결제 완료)
   └── 설정된 successUrl로 리다이렉션
         ↓
5. 프론트 (TossSuccess.jsx)
   └── 백엔드로 paymentKey, orderId 전달
         ↓
6. 백엔드 (/api/payments/success)
   └── Toss 승인 API 호출 → 예약 정보 DB 저장
         ↓
7. 사용자 (MyReservations.jsx)
   └── 결제 후 예약 내역 자동 반영


## ⚙️ 기술 스택

### 🖥️ 백엔드 (Spring Boot)

- **Java 17** – 최신 LTS 버전
- **Spring Boot 3.4.6** – 빠르고 생산적인 스프링 부트 프레임워크
- **Spring Data JPA** – 데이터베이스 연동 및 ORM 지원
- **Spring Security** – 인증 및 권한 관리
- **Spring Web** – REST API 구축
- **Spring Mail** – 이메일 발송 기능
- **MySQL Connector** – MySQL 데이터베이스 드라이버
- **Lombok** – 코드 자동 생성 (Getter, Setter 등)
- **Spring Boot DevTools** – 개발 편의성 향상 (자동 재시작 등)
- **JJWT** – JWT 토큰 생성 및 검증 (JSON Web Token)
- **Google API Client** – 구글 API 연동 지원
- **JUnit 5** – 단위 테스트 및 통합 테스트

### 🖥️ 프론트엔드 (React + Vite)

- **React 19** – 최신 버전의 컴포넌트 기반 UI 라이브러리
- **Vite** – 빠른 빌드를 위한 모던 프론트엔드 빌드 도구
- **React Router v7** – 클라이언트 사이드 라우팅
- **Axios** – HTTP 통신 라이브러리
- **JWT-Decode** – 토큰 파싱을 위한 라이브러리
- **Date Libraries**
  - `date-fns`, `react-datepicker`, `react-calendar`
- **UI 컴포넌트**
  - **Material UI (MUI)** – `@mui/material`, `@mui/icons-material`
  - **Bootstrap & Reactstrap** – `bootstrap`, `react-bootstrap`, `reactstrap`
  - **Emotion** – CSS-in-JS 스타일링 (`@emotion/react`, `@emotion/styled`)
- **아이콘 및 슬라이더**
  - `react-icons`, `swiper`
- **OAuth 연동**
  - 카카오 로그인: `react-kakao-login`
  - 네이버 로그인: `react-naver-login`
  - 구글 로그인: `@react-oauth/google`
- **결제 연동**
  - 토스페이먼츠 SDK: `@tosspayments/tosspayments-sdk`
- **기타**
  - `react-modal`, `react-big-calendar`, `react-bootstrap`

### 🧪 개발 도구 및 환경

- **ESLint** – 코드 정적 분석 도구
- **Type 정의** – `@types/react`, `@types/react-dom`
- **Vite Plugin** – `@vitejs/plugin-react`
- **환경 구성** – `.env`, `vite.config.js`, `eslint.config.js`

---
## 🚀 STAYPICK 운영 배포 구조 (Nginx + Spring Boot + React)

STAYPICK는 AWS EC2 서버에서 Nginx를 중심으로 프론트엔드(React)와 백엔드(Spring Boot)를 통합하여  
실제 서비스 환경에 맞는 HTTPS 기반의 안정적인 운영 구조를 구축하였습니다.

---

### 📦 시스템 구성 요약

| 구성 요소 | 역할 | 경로 |
|-----------|------|------|
| **Nginx** | 리버스 프록시, 정적 파일 서빙, HTTPS 처리 | 443/80 포트 |
| **React** | 사용자 UI 제공 (SPA), `/` 경로에서 작동 | `/var/www/html` |
| **Spring Boot** | API 처리, DB 연동, Toss 결제/예약 로직 | `localhost:8081` |
| **정적 이미지** | 썸네일, 리뷰 이미지 등 | `/upload/**` |

---

### ⚙️ 주요 구성

#### 프론트엔드 (React)
- 모든 UI 페이지 구성 및 렌더링
- React Router 기반 SPA 방식
- axios로 백엔드 `/api/**` 호출
- 빌드 결과를 `/var/www/html`에 배포하여 Nginx가 정적 파일로 응답

#### 백엔드 (Spring Boot)
- 로그인, 예약, 리뷰, 결제 등 핵심 비즈니스 로직 처리
- Toss Payments API 연동도 백엔드에서 실행 (보안 확보)
- `/api/**` 및 `/upload/**` 경로 요청 담당

#### Nginx (리버스 프록시)
- HTTPS 인증 처리 (Let's Encrypt)
- 정적 파일 직접 응답 (CSS, JS, 이미지 등)
- `/api/`, `/upload/` 요청은 백엔드로 전달
- SPA 라우팅 처리 → 모든 경로를 `/index.html`로 fallback
- HTTP 요청은 HTTPS로 강제 리디렉션

---

### 🔐 HTTPS 적용 이유
- 사용자 로그인/결제 정보를 암호화
- Toss Payments 연동 필수 조건
- 무료 SSL 인증서 Let's Encrypt 적용

---

### 🔁 요청 흐름 요약


[사용자]
  ↓
[Nginx]
  ├─ /api/**     → Spring Boot 백엔드 (예약, 결제 등)
  ├─ /upload/**  → 이미지 응답
  └─ 정적 파일   → React 빌드 파일(main.js, style.css 등)

## 🗂️ 프로젝트 구조 

```
staypick/
├── staypick_back/ # 🖥️ Spring Boot 백엔드
│ └── src/
│ └── main/
│ └── java/com/staypick/staypick_back/
│ ├── StaypickBackApplication.java # 메인 클래스
│ ├── controller/ # 사용자/관리자 컨트롤러
│ │ └── api/ # API 전용 컨트롤러
│ ├── dto/ # 요청/응답 DTO
│ ├── entity/ # JPA 엔티티
│ ├── exception/ # 전역 예외 처리
│ ├── repository/ # JPA 리포지토리
│ ├── security/ # Spring Security 설정
│ ├── service/ # 비즈니스 로직
│ └── util/ # 유틸리티 클래스

├── staypick_front/ # 🌐 React 프론트엔드
│ ├── public/
│ │ ├── data/ # 더미 JSON 데이터
│ │ ├── imgs/
│ │ └── admin/data/ # 관리자용 샘플 데이터
│ ├── src/
│ │ ├── assets/images/ # 이미지 리소스
│ │ ├── components/ # 공용 UI 컴포넌트
│ │ ├── pages/ # 사용자 페이지
│ │ ├── admin/ # 관리자 페이지
│ │ │ ├── components/ # 관리자 전용 컴포넌트
│ │ │ ├── pages/ # 관리자 전용 페이지
│ │ │ └── layout/ # 관리자 레이아웃
│ │ ├── routes/ # 라우팅 설정
│ │ ├── context/ # 전역 상태 관리
│ │ ├── api/ # Axios 인스턴스
│ │ ├── css/ # 스타일시트
│ │ ├── App.jsx # 앱 루트
│ │ ├── Layout.jsx # 기본 레이아웃
│ │ ├── main.jsx # 엔트리 포인트
│ │ └── index.css
│ ├── .env
│ ├── index.html
│ ├── package.json
│ ├── vite.config.js
│ └── yarn.lock
```

---

## 🚀 실행 방법

### 1. 프론트엔드 환경 변수 (`.env`)

```env
VITE_KAKAO_KEY=카카오 개발자 api 키
VITE_NAVER_CLIENT_ID=네이버 개발자 client 키
VITE_NAVER_REDIRECT_URI=http://localhost:5173/login
VITE_NAVER_CLIENT_SECRET=네이버 개발자 secret 키
REACT_APP_API_URL=http://localhost:8081
VITE_TOSS_CLIENT_KEY=토스 개발자 client 키
```

### 2. 백엔드 설정 (`application.yml`)

```yaml
server:
  port: 8081
  servlet:
    encoding:
      charset: UTF-8
      enabled: true
      force: true

spring:
  datasource:
    url: DB URL
    username: DB 유저네임
    password: DB 비밀번호
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: update  # 운영 환경에서는 주의 필요
    show-sql: true
    properties:
      hibernate:
        format_sql: true

  mail:
    host: smtp.gmail.com
    port: 587
    username: gmail 아이디
    password: gmail 앱 비밀번호(gmail 비밀번호 아님)
    protocol: smtp
    default-encoding: UTF-8
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true

jwt:
  secret: JWT 비밀키
  expiration-time: 86400000 # 1일 (밀리초 단위)

kakao:
  api:
    key: 카카오 개발자 api 키

naver:
  client-id: 네이버 개발자 client 키
  client-secret: 네이버 개발자 secret 키

toss:
  secret:
    key: 토스 개발자 client 키

```

### 3. 실행 절차

#### 1. 백엔드 실행

- StaypickBackApplicaiton.java를 통해 실행

#### 2. 프론트엔드 실행

```powershell
npm run dev
```

### 4. 접속 URL

- 프론트엔드: http://localhost:5173
- 백엔드 API: http://localhost:8081

---

## 📝 향후 개발 예정

- 모바일 반응형 UI 개선
- 로그인 오류 수정
- 숙소 관리자 전용 회원가입 추가
- 회원가입시 이메일 인증이나 휴대폰 인증 추가
- 추천 숙소 알고리즘 추가
- 숙소별 태그 추가
- 이전 리뷰 이미지 출력 오류 수정
- 서비스 및 부대시설 이미지 추가
- 쿠폰 출력 오류 추가
- 결제하기 버튼 누른 이후의 페이지 뒤로가기 버튼 추가
- 결제 중단시 숙소 정보 페이지로 이동하는 버튼 추가
- 결제 실패 안정화
- 관리자 페이지 숙소 및 객실 정보 수정 부분 이미지 변경 기능 추가
- 관리자 페이지 기간 관리 페이지 주말이나 공휴일은 자동으로 처리되게 수정
- 다국어 지원
- 배포 환경 안정화

---

## 📮 문의

- 개발자 이메일: staypicktest@gmail.com

---

## 📄 라이선스

MIT 라이선스 (MIT License)

저작권 (c) 2025 ca1yp2

본 프로젝트는 학습 및 팀 프로젝트 용도로 제작되었습니다. 어떤 보증도 제공되지 않습니다.  
소프트웨어를 자유롭게 사용할 수 있으나, 상업적 사용은 제한될 수 있습니다.

MIT License

This project is licensed under the MIT License,  
with the following additional notice:

> 📌 This software was created for **educational and team portfolio purposes only**,  
> and **not intended for commercial use**
