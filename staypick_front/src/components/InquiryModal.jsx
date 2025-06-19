import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axiosInstance from '../api/axiosInstance';
import '../css/components/InquiryModal.css';

const InquiryModal = ({ show, onHide, accommodationId }) => {
  const [userInfo, setUserInfo] = useState({
    id: '',
    name: '',
    email: '',
    phone: ''
  });
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [inquiryType, setInquiryType] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axiosInstance.get('/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        const user = res.data;
        setUserInfo({
          id: user.userid || '',
          name: user.username || '',
          email: user.email || '',
          phone: user.tel || ''
        });
      } catch (err) {
        console.error(" 사용자 정보 불러오기 실패:", err);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!userInfo.id || !title || !content || !inquiryType) {
    alert('모든 항목을 입력해주세요.');
    return;
  }

  try {
    const payload = {
      title,
      content,
      inquiryType,
      accommodationId
    };

    // URL에서 userId 제거
    await axiosInstance.post(`/inquiries`, payload);
    alert('문의가 정상적으로 접수되었습니다. 접수된 문의는 마이페이지에서 확인가능합니다.');
    onHide();
  } catch (error) {
    console.error('❌ 문의 등록 실패:', error);
    alert('문의 등록 중 오류가 발생했습니다.');
  }
};

  return (
    <Modal show={show} onHide={onHide} dialogClassName="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>문의하기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicId" className='mb-3'>
            <Form.Label>아이디</Form.Label>
            <Form.Control type="text" value={userInfo.id} disabled />
          </Form.Group>

          <Form.Group controlId="formBasicName" className='mb-3'>
            <Form.Label>이름</Form.Label>
            <Form.Control type="text" value={userInfo.name} disabled />
          </Form.Group>

          <Form.Group controlId="formInquiryType" className='mb-3'>
            <Form.Label>문의 종류</Form.Label>
            <Form.Select
              value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value)}
              required
            >
              <option value="">선택하세요</option>
              <option value="가격">가격</option>
              <option value="객실">객실</option>
              <option value="시설">시설</option>
              <option value="기타">기타</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formBasicTitle" className='mb-3'>
            <Form.Label>제목</Form.Label>
            <Form.Control
              type="text"
              placeholder="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicContent" className='mb-3'>
            <Form.Label>내용</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="내용"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit" className="me-2">제출</Button>
            <Button variant="secondary" onClick={onHide}>취소</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default InquiryModal;
