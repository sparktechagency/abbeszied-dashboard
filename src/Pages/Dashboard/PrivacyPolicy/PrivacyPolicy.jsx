import React, { useRef, useState, useMemo } from "react";
import JoditEditor from "jodit-react";
import ButtonEDU from "../../../components/common/ButtonEDU";

function PrivacyPolicy() {
  const editor = useRef(null);
  const [content, setContent] = useState(
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium totam voluptates blanditiis dicta facilis..."
  );

  const config = useMemo(
    () => ({
      theme: "default",
      showCharsCounter: false,
      showWordsCounter: false,
      toolbarAdaptive: true,
      toolbarSticky: false,
      enableDragAndDropFileToEditor: false,
      allowResizeX: false,
      allowResizeY: false,
      statusbar: false,
      buttons: [
        "source",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "image",
        "table",
        "link",
        "|",
        "left",
        "center",
        "right",
        "justify",
        "|",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "fullsize",
      ],
      useSearch: false,
      spellcheck: false,
      iframe: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      toolbarButtonSize: "small",
      readonly: false,
      observer: { timeout: 100 },
    }),
    []
  );

  const handleSave = () => {
    console.log("Saved Content:", content);
  };

  return (
    <>
      <div className="w-full ">
        <h1 className="text-[20px] font-medium pt-5">Privacy Policy</h1>
        <div className="w-5/5 bg-black">
          <JoditEditor
            className="my-5 bg-red-300"
            ref={editor}
            value={content}
            onChange={(newContent) => setContent(newContent)}
            config={config}
          />
        </div>
        <div className="flex items-center justify-end">
          <ButtonEDU
            className="bg-smart text-[16px] text-white px-10 py-2.5 mt-5 rounded-md"
            onClick={handleSave}
          >
            Save
          </ButtonEDU>
        </div>
      </div>
    </>
  );
}

export default React.memo(PrivacyPolicy);
