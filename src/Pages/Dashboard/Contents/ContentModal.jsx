import { IoMdCloseCircleOutline, IoMdCloseCircle } from "react-icons/io";
import ContentsForm from "./ContentsForm";
import { Button } from "antd";
// import ModalForm from "./BlogForm";

const ContentModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-gray-100 p-10  rounded-2xl shadow-lg w-[1000px] h-[800px] relative"
        onClick={handleModalClick}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          <IoMdCloseCircleOutline
            size={26}
            className="fill-gray-600 hover:fill-black transition-colors duration-200"
          />
        </button>
        <div className="w-full h-auto flex justify-between">
          <h2 className="text-lg font-semibold">Adding New Categories</h2>
          {/* <Button
            className="bg-dashboard text-white"
            style={{ width: "180px", height: "45px", borderRadius: "16px" }}
          >
            Create Category
          </Button> */}
        </div>

        <ContentsForm />
      </div>
    </div>
  );
};

export default ContentModal;
