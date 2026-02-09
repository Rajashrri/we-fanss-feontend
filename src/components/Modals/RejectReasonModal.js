// src/components/Modals/RejectReasonModal.jsx
import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Label } from 'reactstrap';

const RejectReasonModal = ({ isOpen, toggle, onConfirm, itemTitle }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }
    onConfirm(reason);
    setReason('');
    setError('');
  };

  const handleCancel = () => {
    setReason('');
    setError('');
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={handleCancel} centered>
      <ModalHeader toggle={handleCancel}>
        Reject Item
      </ModalHeader>
      <ModalBody>
        <p className="mb-3">
          Are you sure you want to reject <strong>"{itemTitle}"</strong>?
        </p>
        <div>
          <Label for="rejectReason">Reason for Rejection *</Label>
          <Input
            type="textarea"
            id="rejectReason"
            rows="4"
            placeholder="Enter reason for rejection..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError('');
            }}
            invalid={!!error}
          />
          {error && <div className="text-danger mt-1" style={{ fontSize: '14px' }}>{error}</div>}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button color="danger" onClick={handleConfirm}>
          Reject
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default RejectReasonModal;