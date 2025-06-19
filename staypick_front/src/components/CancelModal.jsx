import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  FormControlLabel,
  Typography
} from '@mui/material';

const CancelModal = ({ open, onClose, onConfirm }) => {
  const [checked, setChecked] = useState(false);

  const handleConfirm = () => {
    if (checked) {
      onConfirm();
      setChecked(false); // 모달 닫힌 후 체크박스 초기화
    }
  };

  const handleClose = () => {
    setChecked(false); // 취소 시도할 때도 초기화
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>예약 취소 확인</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          정말 예약을 취소하시겠습니까? 취소된 예약은 복구할 수 없습니다.
        </Typography>
        <Typography gutterBottom>
          환불 정책을 확인하셨나요? 사유에 따라 수수료가 발생할 수 있습니다.
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
          }
          label="위 내용을 확인하였으며, 취소에 동의합니다."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button
          onClick={handleConfirm}
          color="error"
          disabled={!checked}
          variant="contained"
        >
          예약 취소하기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelModal;
