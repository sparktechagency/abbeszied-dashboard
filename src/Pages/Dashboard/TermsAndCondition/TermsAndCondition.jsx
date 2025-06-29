import React, { useRef, useState, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";

import {
  useGetTermsAndConQuery,
  useUpdatePoliciesMutation,
} from "../../../redux/apiSlices/cmsSlice";

function TermsAndCondition() {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch Terms and Con data
  const {
    data: termsAndConData,
    isLoading,
    error,
    refetch,
  } = useGetTermsAndConQuery();

  console.log("skjh", termsAndConData?.data?.content);

  // Update Terms and Conditon  mutation
  const [updateTermsAndCon, { isLoading: isUpdating, error: updateError }] =
    useUpdatePoliciesMutation();

  // Set content when data is fetched
  useEffect(() => {
    if (termsAndConData?.data?.content) {
      setContent(termsAndConData?.data?.content);
    }
  }, [termsAndConData]);

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

  const handleSave = async () => {
    if (!content.trim()) {
      alert("Terms & Conditions content cannot be empty");
      return;
    }

    try {
      setIsSaving(true);
      const result = await updateTermsAndCon({
        termsOfService: content,
      }).unwrap();

      console.log("Terms & Conditions updated successfully:", result);

      // Optionally refetch the data
      refetch();
    } catch (error) {
      console.error("Failed to update Terms & Conditions:", error);
      alert("Failed to update Terms & Conditions. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-[400px] border rounded-lg bg-white px-4 py-5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-smart mx-auto mb-2"></div>
          <p>Loading Terms & Conditions ...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-[400px] border rounded-lg bg-white px-4 py-5 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading Terms & Conditions ...</p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-smart text-white rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-[fit] border rounded-lg bg-white px-4 py-5">
        <h1 className="text-[20px] font-medium py-5 w-fit mx-auto">
          Terms & Conditions
        </h1>

        {/* Show update error if any */}
        {updateError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            Error updating Terms & Conditions. Please try again.
          </div>
        )}

        <div className="w-5/5 rounded-md">
          <JoditEditor
            className="my-5"
            ref={editor}
            value={content}
            onChange={(newContent) => setContent(newContent)}
            config={config}
          />
        </div>

        <div className="flex items-center justify-end">
          <button
            className={`text-[16px] text-white px-10 py-2.5 mt-5 rounded-md ${
              isSaving || isUpdating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-abbes hover:bg-smart-dark"
            }`}
            onClick={handleSave}
            disabled={isSaving || isUpdating}
          >
            {isSaving || isUpdating ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </>
  );
}

export default React.memo(TermsAndCondition);
