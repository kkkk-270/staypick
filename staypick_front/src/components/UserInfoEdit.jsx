import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap';

const UserInfoEdit = ({ show, onHide, name, phone, onNameChange, onPhoneChange, onSave }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
    <Modal.Header closeButton>
      <Modal.Title>예약자 정보 변경</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>성명</Form.Label>
          <Form.Control
            type="text"
            placeholder="이름"
            value={name}
            onChange={onNameChange}
            onKeyDown={(e) => {
              if(e.key === ' ') e.preventDefault();
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>휴대폰 번호</Form.Label>
          <Form.Control
            type="text"
            placeholder="전화번호"
            value={phone}
            onChange={onPhoneChange}
            onKeyDown={(e) => {
              if(e.key === ' ') e.preventDefault();
            }}
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="primary" onClick={onSave}>
        저장
      </Button>
      <Button variant="secondary" onClick={onHide}>
        취소
      </Button>
    </Modal.Footer>
  </Modal>
  )
}

export default UserInfoEdit