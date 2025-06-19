import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const ReservationGuide = ({show, onHide}) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg" style={{maxHeight: '100vh'}}>
      <Modal.Header closeButton>
        <Modal.Title>숙박 예약 안내사항</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '100vh', overflowY: 'auto' }}>
        <p>원활하고 즐거운 여행을 위해 아래 안내사항을 꼼꼼히 확인해 주시기 바랍니다.</p>
        <h5>1. 예약 관련</h5>
        <ul>
          <li><strong>정확한 정보 입력:</strong> 예약 시 정확한 투숙 날짜, 인원수, 객실 타입, 예약자 정보 (성함, 연락처) 등을 확인하여 입력해 주시기 바랍니다. 잘못된 정보 입력으로 인해 발생하는 불이익에 대해서는 책임지지 않습니다.</li>
          <li><strong>예약 확정:</strong> 예약 완료 후 예약 확정 메일 또는 문자를 반드시 확인해 주십시오. 예약 번호는 체크인 시 필요하니 보관해 주시기 바랍니다.</li>
          <li><strong>인원 기준:</strong> 객실별 기준 인원 및 최대 인원을 확인해 주십시오. 기준 인원 초과 시 추가 요금이 발생할 수 있습니다.</li>
          <li><strong>미성년자 예약:</strong> 미성년자는 보호자 동반 없이 단독으로 숙박이 불가할 수 있습니다. 숙소 규정을 확인해 주십시오.</li>
          <li><strong>특별 요청:</strong> 특별한 요청 사항 (예: 고층/저층 객실, 침대 타입 등)은 예약 시 기재해 주시면 최대한 반영하도록 노력하겠습니다. 다만, 현장 상황에 따라 불가할 수 있습니다.</li>
        </ul>
        <h5>2. 체크인/체크아웃</h5>
        <ul>
          <li><strong>체크인 시간:</strong> 일반적으로 오후 [체크인 시작 시간]부터 가능합니다. 얼리 체크인은 숙소 사정에 따라 추가 요금이 발생하거나 불가할 수 있습니다.</li>
          <li><strong>체크아웃 시간:</strong> 일반적으로 오전 [체크아웃 마감 시간]까지입니다. 레이트 체크아웃은 숙소 사정에 따라 추가 요금이 발생하거나 불가할 수 있습니다.</li>
          <li><strong>필수 지참물:</strong> 체크인 시 예약자 본인 확인을 위한 신분증 (주민등록증, 운전면허증, 여권 등)을 반드시 지참해 주십시오.</li>
          <li><strong>보증금:</strong> 숙소에 따라 보증금 결제를 요청할 수 있으며, 체크아웃 시 객실 점검 후 환불됩니다.</li>
        </ul>
        <h5>3. 객실 이용</h5>
        <ul>
          <li><strong>객실 비품:</strong> 객실 내 비치된 물품 (수건, 세면도구, 드라이기 등)은 숙소의 자산이므로 훼손 또는 반출 시 비용이 청구될 수 있습니다.</li>
          <li><strong>안전 및 보안:</strong> 객실 내 화기 사용은 엄격히 금지되어 있습니다. 귀중품은 프런트 데스크에 보관하거나 개인적으로 안전하게 관리해 주십시오.</li>
          <li><strong>소음:</strong> 다른 투숙객을 위해 늦은 시간이나 이른 시간에는 소음 발생에 주의해 주시기 바랍니다.</li>
          <li><strong>반려동물:</strong> 일반적으로 반려동물 동반 투숙은 불가합니다. 단, 특정 숙소의 경우 별도의 규정에 따라 가능할 수 있으니 예약 전 확인해 주십시오.</li>
          <li><strong>금연:</strong> 대부분의 숙소는 금연 구역입니다. 지정된 흡연 구역을 이용해 주십시오.</li>
        </ul>
        <h5>4. 결제 및 취소/환불</h5>
        <ul>
          <li><strong>결제 방법:</strong> 예약 시 안내된 결제 방법 (신용카드, 계좌이체 등)을 확인해 주십시오.</li>
          <li><strong>취소 및 환불 규정:</strong> 예약 취소 시에는 숙소의 취소 및 환불 규정에 따라 수수료가 발생하거나 환불이 불가할 수 있습니다. 예약 전 취소 및 환불 규정을 반드시 확인해 주십시오.</li>
          <li><strong>환불 처리:</strong> 환불이 진행될 경우, 처리 기간은 결제 수단 및 숙소 정책에 따라 다소 소요될 수 있습니다.</li>
        </ul>
        <h5>5. 기타</h5>
        <ul>
          <li><strong>주차:</strong> 주차 가능 여부 및 주차 요금을 예약 전 확인해 주십시오.</li>
          <li><strong>조식:</strong> 조식 포함 여부 및 이용 시간을 확인해 주십시오.</li>
          <li><strong>부대시설:</strong> 숙소 내 부대시설 (수영장, 피트니스센터 등) 이용 시간 및 규정을 확인해 주십시오.</li>
          <li><strong>문의사항:</strong> 예약 변경, 취소, 기타 문의사항은 숙소 프런트 데스크 또는 예약 담당 부서로 연락해 주시기 바랍니다.</li>
        </ul>
        <p>즐거운 숙박 되시길 바랍니다.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ReservationGuide