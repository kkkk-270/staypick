import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Modal } from 'react-bootstrap';

const MapModal = ({ show, onHide, address }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  const [isKakaoLoadingError, setIsKakaoLoadingError] = useState(false);
  const [geocoderLoading, setGeocoderLoading] = useState(false);
  const [geocoderError, setGeocoderError] = useState(null);

  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 });
  const [markerPosition, setMarkerPosition] = useState(null);

  const kakaoApiKey = import.meta.env.VITE_KAKAO_KEY;

  const handleLoadKakao = useCallback(() => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        setIsKakaoLoaded(true);
        console.log('Kakao Maps API 로드 완료 (handleLoadKakao)');
      });
    }
  }, []);

  const handleLoadError = useCallback(() => {
    setIsKakaoLoadingError(true);
    console.error('Kakao Maps API 로드 실패');
  }, []);

  useEffect(() => {
    if (show && !isKakaoLoaded && !isKakaoLoadingError) {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&libraries=services&autoload=false`;
      script.async = true;
      script.onload = handleLoadKakao;
      script.onerror = handleLoadError;
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [show, isKakaoLoaded, isKakaoLoadingError, kakaoApiKey, handleLoadKakao, handleLoadError]);

  useEffect(() => {
    if (show && address && isKakaoLoaded && window.kakao && window.kakao.maps.services) {
      setGeocoderLoading(true);

      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
          const { y, x } = result[0];
          const coords = new window.kakao.maps.LatLng(y, x);

          setMapCenter({ lat: parseFloat(y), lng: parseFloat(x) });
          setMarkerPosition({ lat: parseFloat(y), lng: parseFloat(x) });

          if (mapInstance.current) {
            mapInstance.current.panTo(coords);

            if (markerRef.current) {
              markerRef.current.setMap(null);
            }
            const marker = new window.kakao.maps.Marker({
              position: coords,
              map: mapInstance.current,
            });
            markerRef.current = marker;
          }
          setGeocoderError(null);
        } else {
          setGeocoderError('해당 주소의 위치를 찾을 수 없습니다.');
          console.error("해당 주소의 위치를 찾을 수 없습니다.")
          setMarkerPosition(null);
          setMapCenter({ lat: 37.5665, lng: 126.9780 });
        }
        setGeocoderLoading(false);
      });
    }
  }, [show, address, isKakaoLoaded]);

  useEffect(() => {
    if (show && isKakaoLoaded && mapRef.current && window.kakao && window.kakao.maps && !mapInstance.current) {
      const options = {
        center: new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
        level: 3,
      };
      mapInstance.current = new window.kakao.maps.Map(mapRef.current, options);
    }
  }, [show, isKakaoLoaded, mapCenter]);

  useEffect(() => {
    if (!show) {
      setIsKakaoLoaded(false);
      setIsKakaoLoadingError(false);
      setGeocoderLoading(false);
      setGeocoderError(null);
      setMarkerPosition(null);
      setMapCenter({ lat: 37.5665, lng: 126.9780 });
      if (mapInstance.current) {
        mapInstance.current.setLevel(3);
        mapInstance.current.panTo(new window.kakao.maps.LatLng(37.5665, 126.9780));
        mapInstance.current = null; // 지도 인스턴스 정리
      }
    }
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>위치 정보</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div ref={mapRef} style={{ width: '100%', height: '400px' }}>
          {!isKakaoLoaded && !isKakaoLoadingError && <div>카카오 지도 API를 로딩 중입니다...</div>}
          {isKakaoLoadingError && <div style={{ color: 'red' }}>카카오 지도 API 로딩에 실패했습니다.</div>}
          {geocoderLoading && <div>주소를 검색 중입니다...</div>}
          {geocoderError && <div>{geocoderError}</div>}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MapModal;