import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { RiArrowRightSLine, RiStarFill, RiMapPin2Fill, RiPhoneFill } from 'react-icons/ri';
import '../css/detail.css';
import 'bootstrap/dist/css/bootstrap.css';
import Room from '../components/Room';
import MapModal from '../components/MapModal';
import InquiryModal from '../components/InquiryModal';
import axiosInstance from '../api/axiosInstance';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Detail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: hotelIdFromUrl } = useParams();

  const checkInDate = location.state?.checkInDate || '';
  const checkOutDate = location.state?.checkOutDate || '';
  const guestCount = location.state?.guestCount || 1;

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roomInfos, setRoomInfos] = useState([]);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [isInquiryModalVisible, setIsInquiryModalVisible] = useState(false);

  useEffect(() => {
    if (!hotelIdFromUrl) {
      setError('호텔 ID가 없습니다.');
      setLoading(false);
      return;
    }

    const fetchHotelDetail = async () => {
      try {
        const hotelId = parseInt(hotelIdFromUrl);
        const [hotelRes, serviceRes, reviewRes, roomRes, imageRes] = await Promise.allSettled([
          axiosInstance.get(`/accommodations/${hotelId}`),
          axiosInstance.get(`/accommodations/${hotelId}/services`),
          axiosInstance.get(`/reviews/accommodation/${hotelId}`),
          axiosInstance.get(`/accommodations/${hotelId}/rooms`),
          axiosInstance.get(`/accommodations/${hotelId}/images`)
        ]);

        if (hotelRes.status === 'fulfilled') setHotel(hotelRes.value.data);
        if (serviceRes.status === 'fulfilled') setServices(serviceRes.value.data);
        if (reviewRes.status === 'fulfilled') setReviews(reviewRes.value.data);
        if (roomRes.status === 'fulfilled') setRoomInfos(roomRes.value.data);
        if (imageRes.status === 'fulfilled') setImageList(imageRes.value.data);
      } catch (err) {
        setError('서버 응답 중 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetail();
  }, [hotelIdFromUrl]);

  const handleReservation = () => {
    if (hotel && roomInfos.length > 0) {
      const room = roomInfos[0];
      navigate('/payment', {
        state: {
          hotel,
          roomInfo: {
            name: room.roomName,
            roomType: room.roomType,
            roomNumber: room.roomNumber,
            personnel: room.personnel,
            checkin: room.checkin,
            checkout: room.checkout,
            discountPrice: room.discountPrice,
            regularPrice: room.price,
          },
          checkInDate,
          checkOutDate,
          guestCount,
        },
      });
    } else {
      alert('호텔 정보나 객실 정보가 없습니다.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!hotel) return <div>호텔 정보를 찾을 수 없습니다.</div>;

  return (
    <Container>
      <Row>
        <Col md={5}>
          <div className="room-type">{hotel.category}</div>
          <div className="acc-name">{hotel.name}</div>
          <div className="acc-tag">#인기있는 숙소 #후기 좋은 숙소</div>
          <div className="pricetag">
            {roomInfos.length > 0
              ? `${Math.min(...roomInfos.map(r => r.price)).toLocaleString()}원~`
              : '가격정보 없음'}
          </div>

          <div className="review-table">
            <div className="text-wrapper-5">
              <span onClick={() => navigate(`/reviewdetail/${hotel.id}`)}>
                후기 {reviews.length > 0 ? `(${reviews.length})` : '(0)'} <RiArrowRightSLine />
              </span>
            </div>

            {reviews.length > 0 && (
              <Swiper
                modules={[Autoplay, Mousewheel, Navigation, Pagination]}
                slidesPerView={1}
                loop={reviews.length > 1}
                mousewheel
                pagination={{ clickable: true }}
                autoplay={{ delay: 7000, disableOnInteraction: false }}
              >
                {reviews.map((review, index) => (
                  <SwiperSlide key={index}>
                    <Row className="ml">
                      <Col md={9}>
                        <div className="reviewbox">
                          <div className="grade">
                            {[...Array(Math.round(review.rating))].map((_, i) => (
                              <RiStarFill key={i} className="yellow" />
                            ))}
                          </div>
                          <div className="review">{review.content}</div>
                          {review.imageUrl && (
                            <div className="review-images">
                              <img
                                src={`http://localhost:8081${review.imageUrl}`}
                                alt="리뷰 이미지"
                                className="review-thumbnail"
                              />
                            </div>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          <div className="service-table">
            <div className="service-main">서비스 및 부대시설</div>
            <Row className="ml">
              {services.map((service, index) => (
                <Col md={4} key={index}>
                  <span>
                    <img
                      src={`http://localhost:8081/upload/icons/${service.image}`}
                      alt={service.name}
                      onError={(e) => {
                        if (!e.target.src.includes('default.png')) {
                          e.target.src = '/upload/icons/default.png';
                        }
                      }}
                    />
                    {service.name}
                  </span>
                </Col>
              ))}
            </Row>
          </div>

          <div className="location-table">
            <div className="location-main">위치 정보</div>
            <div className="location-sub1">
              <RiMapPin2Fill /> {hotel.address}
              <span onClick={() => setIsMapModalVisible(true)}>지도보기</span>
            </div>
            <div className="location-sub2">
              <RiPhoneFill /> {hotel.tel}
              <span onClick={() => setIsInquiryModalVisible(true)}>문의하기</span>
            </div>
          </div>
        </Col>

        <Col md={7} className="mt-10">
          <Row className="imgbox">
            <Col md={6} className="imgbox1">
              <img
                src={`http://localhost:8081/upload/hotel-images/${hotel.thumbnail || 'default.jpg'}`}
                alt={hotel.name}
              />
            </Col>
            <Col md={6}>
              <Row className="imgbox2">
                {imageList.slice(0, 4).map((img, index) => (
                  <Col md={6} key={index}>
                    <div className="thumb-wrapper">
                      <img
                        src={`http://localhost:8081/upload/hotel-detail-images/${img}`}
                        alt={`상세 이미지 ${index + 1}`}
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>

          <Room
            infos={roomInfos}
            hotel={hotel}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            guestCount={guestCount}
          />
        </Col>
      </Row>

      <MapModal show={isMapModalVisible} onHide={() => setIsMapModalVisible(false)} address={hotel.address} />
      <InquiryModal show={isInquiryModalVisible} onHide={() => setIsInquiryModalVisible(false)} accommodationId={hotel.id} />
    </Container>
  );
};

export default Detail;
