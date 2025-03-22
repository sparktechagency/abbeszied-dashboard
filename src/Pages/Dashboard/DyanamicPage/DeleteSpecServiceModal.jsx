import React from "react";
import { Modal } from "antd";
import ButtonEDU from "../../../../components/common/ButtonEDU";

function DeleteCategoryModal({
  isDeleteModalOpen,
  deletingRecord,
  onCancelDelete,
  onConfirmDelete,
}) {
  return (
    <Modal
      title="Delete Confirmation"
      visible={isDeleteModalOpen}
      onCancel={onCancelDelete}
      footer={null}
      centered
    >
      <div className="flex flex-col justify-between gap-5">
        <div className="flex justify-center">
          Are you sure you want to delete{" "}
          <span className="font-bold ml-1">{deletingRecord?.name}</span>?
        </div>
        <div className="flex justify-center gap-4">
          <ButtonEDU actionType="cancel" onClick={onCancelDelete} />
          <ButtonEDU actionType="delete" onClick={onConfirmDelete} />
        </div>
      </div>
    </Modal>
  );
}

export default DeleteCategoryModal;
