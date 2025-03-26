import React, { useState, useEffect } from "react";

import { Button, ConfigProvider, Modal, Image, message } from "antd";
import { FiPhoneCall } from "react-icons/fi";
import { HiOutlineEnvelope } from "react-icons/hi2";
import man from "../../../assets/man.png";
import certificate from "../../../assets/certificate.png";
const CertificateModal = ({ isModalOpen, handleCancel, providerData }) => {
  return (
    <Modal
      title={<p className="text-lg font-semibold">Certificate Details</p>}
      visible={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={800}
      className="pending-products-modal"
      centered
    >
      <ConfigProvider
        theme={{
          Button: {},
        }}
      >
        <div className="flex justify-between w-full my-2">
          <div className=" w-1/2 flex flex-col">
            <h2 className="font-medium text-lg">Coach Information</h2>
            <div className="flex gap-2">
              <div>
                <img src={man} width={50} className="border rounded-full"></img>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[16px] font-medium">Abdullah Ahad</p>
                <p>Football Coach</p>

                <p className="flex items-center gap-1">
                  <FiPhoneCall /> +974 5555 1234
                </p>
                <p className="flex items-center gap-1">
                  <HiOutlineEnvelope /> +974 5555 1234
                </p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-medium text-lg">Certificate</h2>
            <div>
              <p className="text-[16px] font-medium mb-2">
                FIFA Level 2 Coaching License
              </p>
              <div>
                <Image
                  src={certificate}
                  width={500}
                  className="border rounded-md border-black mb-2"
                ></Image>

                <ConfigProvider
                  theme={{
                    components: {
                      Button: {
                        defaultHoverBg: "#16a34a  ",
                        defaultHoverColor: "white",
                      },
                    },
                  }}
                >
                  <Button
                    onClick={() => {
                      message.success("Accepted");
                    }}
                    className="bg-green-500/90 hover:bg-green-600 text-white border-none h-6"
                  >
                    Accept
                  </Button>
                </ConfigProvider>
                <ConfigProvider
                  theme={{
                    components: {
                      Button: {
                        defaultHoverBg: "#dc2626   ",
                        defaultHoverColor: "white",
                        colorPrimaryBg: "#dc2626  ",
                      },
                    },
                  }}
                >
                  <Button
                    onClick={() => {
                      message.success("Rejected");
                    }}
                    className="ml-4  bg-red-500/90 hover:bg-red-600 text-white border-none h-6"
                  >
                    Reject
                  </Button>
                </ConfigProvider>
              </div>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </Modal>
  );
};

export default CertificateModal;
