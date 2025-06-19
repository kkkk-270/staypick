import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Button } from 'reactstrap';
import { RiArrowLeftWideFill, RiArrowRightWideFill } from 'react-icons/ri';
import RoomImage from './RoomImage';

const Room = React.memo(({ infos = [], hotel, checkInDate, checkOutDate, guestCount }) => {
  const navigate = useNavigate();

  console.log('✅ Room props - checkInDate:', checkInDate);
  console.log('✅ Room props - checkOutDate:', checkOutDate);
  console.log('✅ Room props - guestCount:', guestCount);

  const reservation = (info) => {
    if (hotel) {
      navigate("/payment", {
        state: {
          hotel,
          roomInfo: {
            id: info.id,
            room_type: info.roomType, // 기존 roomName ->roomType
            roomType: info.roomType,
            roomNumber: info.roomNumber,
            personnel: info.personnel,
            checkin: info.checkin,
            checkout: info.checkout,
            discountPrice: info.discountPrice,
            regularPrice: info.price
          },
          checkInDate,
          checkOutDate,
          guestCount,
        },
      });
    } else {
      alert('선택된 호텔 정보가 없습니다.');
    }
  };

  const filteredRooms = useMemo(() => {
    const grouped = {};
    infos.forEach((room) => {
      const type = room.roomType;
      if (!grouped[type] || (room.image?.trim() && !grouped[type].image?.trim())) {
        grouped[type] = room;
      }
    });

    // 🔍 로그로 확인
    Object.entries(grouped).forEach(([type, info], idx) => {
      console.log(`Room.jsx:${76 + idx * 3} 🧾 [${idx}] roomType:`, type);
      console.log(`Room.jsx:${77 + idx * 3} 🖼️ [${idx}] info.image:`, info.image);
      console.log(`Room.jsx:${78 + idx * 3} 📦 [${idx}] 전체 info 객체:`, info);
    });

    return Object.values(grouped);
  }, [infos]);

  return (
    <div className="rtbox">
      <Row>
        <Col md={1} className="text-center">
          <Button className="hero-prev"><RiArrowLeftWideFill /></Button>
        </Col>
        <Col md={10}>
          <Swiper
            observer={true}
            observeParents={true}
            modules={[Mousewheel, Navigation, Pagination]}
            slidesPerView={1}
            loop={filteredRooms.length > 1}
            navigation={{ nextEl: '.hero-next', prevEl: '.hero-prev' }}
            mousewheel={{ forceToAxis: true }}
            pagination={{ clickable: true }}
            style={{ width: '100%' }} 
          >
            {filteredRooms.map((info) => (
              <SwiperSlide key={info.roomType}>
                <Row>
                  <Col md={4}>
                    <RoomImage
                      src={info.image}
                      alt={info.roomType}
                    />
                  </Col>
                  <Col md={7}>
                    <div className="rtinfo">
                      <Row className="namenbtn">
                        <Col md={9}><div className="rtname">{info.roomType}</div></Col>
                        <Col md={3}>
                          <button className="resbtn" onClick={() => reservation(info)}>예약하기</button>
                        </Col>
                      </Row>
                      <div className="rtinnerbox">
                        <div className="timeninfo">
                          <div className="ribox">
                            <Row className="pt1d2 pb-1">
                              <Col md={2}><div className="pe-2 bold">호실</div></Col>
                              <Col md={10}><div className="subinfo">{info.roomNumber}호</div></Col>
                            </Row>
                            <Row className="pb-1">
                              <Col md={2}><div className="pe-2 bold">인원</div></Col>
                              <Col md={10}><div className="subinfo">{info.personnel}명</div></Col>
                            </Row>
                            <Row className="pb-1">
                              <Col md={2}><div className="pe-2 bold">시간</div></Col>
                              <Col md={10}>
                                <div className="times">
                                  <div className="subinfo">입실 {info.checkin}</div>
                                  <div className="subinfo">퇴실 {info.checkout}</div>
                                </div>
                              </Col>
                            </Row>
                            <Row className="pb-1">
                              <Col md={2}><div className="pe-2 bold">정보</div></Col>
                              <Col md={10}><div className="subinfo">{info.extra}</div></Col>
                            </Row>
                            <Row>
                              <Col md={2}><div className="pe-2 bold">요금</div></Col>
                              <Col md={10}>
                                <div className="subinfo">
                                  {Number(info.discountPrice).toLocaleString()}원
                                  <del> ({Number(info.price).toLocaleString()}원)</del>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </SwiperSlide>
            ))}
          </Swiper>
        </Col>
        <Col md={1} className="text-center">
          <Button className="hero-next"><RiArrowRightWideFill /></Button>
        </Col>
      </Row>
    </div>
  );
});

export default Room;
