import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack";
import Nav from "./Nav";
import { BiSolidPencil } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import { AiFillDelete } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";
import { GrPrevious, GrNext } from "react-icons/gr";
import { FaUserLarge } from "react-icons/fa6";
import { BiDetail } from "react-icons/bi";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";
import "./PdfViewer.css";
import NoteDialog from "./NoteDialog";
import { PiNoteThin } from "react-icons/pi";
import { FaRegFilePdf } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import { PDFDocument, MissingPDFHeaderError } from "pdf-lib";
import Cookies from "js-cookie";
import { API_URL } from "../ConfigApi";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useSelector } from "react-redux";

import { MdOutlinePictureAsPdf, MdOutlineDelete } from "react-icons/md";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const DialogBox = ({ onClose, onAddNote }) => {
  return (
    <div className="pdfview-show-icon-container">
      <div className="pdfview-icon-tooltip"></div>
      <button
        style={{
          background: "none",
          outline: "none",
          border: "none",
          cursor: "pointer",
          whiteSpace: "nowrap",
          marginRight: "15px",
          fontSize: "15px",
        }}
        onClick={onAddNote}
      >
        <PiNoteThin
          style={{
            fontSize: "20px",
            marginBottom: "-4px",
            marginRight: "4px",
            marginLeft: "4px",
          }}
        />
        Add Comments
      </button>

      <button
        style={{
          background: "none",
          outline: "none",
          border: "none",
          cursor: "pointer",
          whiteSpace: "nowrap",
          position: "relative",
          top: "-5px",
          right: "2px",
        }}
        onClick={onClose}
      >
        <RxCross2 />
      </button>
    </div>
  );
};
function PdfViewer() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [viewType, setViewType] = useState("pagination");
  const [scale, setScale] = useState(1.0);
  const userData = useSelector((state) => state.user.userData);
  const userRole = userData?.role;
  console.log(userRole);
  const companyId = userData?.company?.id;

  useEffect(() => {
    // Your effect code goes here
    console.log(companyId);

    // Make sure to return a cleanup function if necessary
    return () => {
      // Cleanup code goes here
    };
  }, [companyId]);

  // async function repairPDF(documentParam) {
  //   try {
  //     const response = await fetch(documentParam);
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch PDF document");
  //     }
  //     const pdfBuffer = await response.arrayBuffer();
  //     const pdfDoc = await PDFDocument.load(pdfBuffer);
  //     // Save the repaired PDF document
  //     const repairedPdfBytes = await pdfDoc.save();
  //     // Optionally, you can update the PDF file on the server with the repaired version
  //     return repairedPdfBytes;
  //   } catch (error) {
  //     console.error("Failed to repair PDF:", error);
  //     throw error;
  //   }
  // }

  // const [policyId, setPolicyId] = useState(null); // State to store policyId
  // const [documentPath, setDocumentPath] = useState("");
  // const location = useLocation();

  // useEffect(() => {
  //   const params = new URLSearchParams(location.search);
  //   const documentParam = params.get("document");
  //   const extractedPolicyId = params.get("policyId");
  //   console.log("Policy ID:", extractedPolicyId);

  //   // Extract only the path part of the URL
  //   const path = new URL(documentParam).pathname;
  //   setDocumentPath(path);

  //   // Set the policyId state
  //   setPolicyId(extractedPolicyId);

  //   // Attempt to repair the PDF document
  //   repairPDF(documentParam)
  //     .then(() => {
  //       console.log("PDF repaired successfully");
  //     })
  //     .catch((error) => {
  //       console.error("Failed to repair PDF:", error);
  //     });
  // }, [location]);

  // const [policyId, setPolicyId] = useState(null);
  // const location = useLocation();

  // useEffect(() => {
  //   const params = new URLSearchParams(location.search);
  //   const extractedPolicyId = params.get("policyId");
  //   console.log("Policy ID:", extractedPolicyId);
  //   setPolicyId(extractedPolicyId);
  // }, [location.search]);
  const { policyId } = useParams();

  useEffect(() => {
    console.log("Policy ID:", policyId);
    // Call your functions or perform actions that depend on the policyId
  }, [policyId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `${API_URL}/main/policy_posts/${policyId}/reviews/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Reviews", data);

        const reviewIds = data.map((review) => review.id);

        console.log("Review IDs", reviewIds);

        return data;
      } else {
        console.error("Failed to fetch data. Status:", response.status);
        return null;
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  const handleEditReviews = async (policyId, reviewId) => {
    try {
      const updatedFields = {};
      const response = await fetch(
        `${API_URL}/main/policy_posts/${policyId}/reviews/${reviewId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          body: JSON.stringify(updatedFields),
        }
      );

      if (response.ok) {
        console.log(
          `Review with policyId ${policyId} and reviewId ${reviewId} has been updated`
        );
        if (response.ok) {
          fetchReviews();
          setIsEditOpen(false);
        }
      } else {
        console.error("Failed to update review. Status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const deleteReview = async (policyId, reviewId) => {
    console.log("Delte icon clicked");
    try {
      const response = await fetch(
        `${API_URL}/main/policy_posts/${policyId}/reviews/${reviewId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        console.log(
          `Review with policyId ${policyId} and reviewId ${reviewId} has been deleted`
        );
        // Optionally, you can perform some action after successful deletion
      } else {
        console.error("Failed to delete review. Status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const storedReviews = localStorage.getItem("reviews");
    if (storedReviews) {
      setEditedData(JSON.parse(storedReviews));
    } else {
      setEditedData([]); // Clear existing reviews when policyId changes
    }
  }, [policyId]); // Add policyId as a dependency

  useEffect(() => {
    if (policyId) {
      // Check if policyId exists
      const fetchData = async () => {
        try {
          const data = await fetchReviews();
          if (data) {
            setEditedData(
              data.map((review) => ({
                policyName: review.policyName,
                rating: review.rating,
                comment: review.comment,
              }))
            );
            localStorage.setItem("reviews", JSON.stringify(data));
          }
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      };
      fetchData();
    }
  }, [policyId]); // Add policyId as a dependency
  
  const handleSubmitReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/main/policy_posts/${policyId}/reviews/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          body: JSON.stringify({
            rating: editedPolicy.rating,
            comment: editedPolicy.comment,
          }),
        }
      );

      if (response.ok) {
        const reviewData = await response.json();
        console.log("Review created:", reviewData);

        setEditedData((prevData) => [
          {
            rating: editedPolicy.rating,
            comment: editedPolicy.comment,
          },
          ...prevData,
        ]);

        Swal.fire({
          icon: "success",
          title: "Review Added Successfully!",
          showConfirmButton: false,
          timer: 1500,
        });

        setisAddModalOpen(false);
      } else {
        console.error("Failed to create review. Status:", response.status);
      }
    } catch (error) {
      console.error("Error creating review:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (policyId) {
      handleSubmitReviews();
    }
  }, [policyId]);

  const toggleView = (type) => {
    setViewType(type);
  };
  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 10));
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.1));
  };
  function changePage(offset) {
    const newPageNumber = pageNumber + offset;
    if (newPageNumber > 0 && newPageNumber <= numPages) {
      setPageNumber(newPageNumber);
    }
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const [userNotesList, setUserNotesList] = useState([]);

  const [isExtended, setIsExtended] = useState(false);
  const handleNotesIconClick = () => {
    setIsExtended(!isExtended);
  };

  const CustomTooltip = ({ children, tooltipText }) => {
    return (
      <div className="custom-tooltip">
        {children}
        <span className="tooltip-text">{tooltipText}</span>
      </div>
    );
  };

  const [selectedText, setSelectedText] = useState("");
  const [selectedTextTransform, setSelectedTextTransform] = useState(null);
  const [showNoteDialog, setShowNoteDialog] = useState(false);

  function closeDialogBox() {
    setShowDialogBox(false);
  }

  function handleTextSelection() {
    const selection = window.getSelection();
    if (selection) {
      const selectedText = selection.toString();
      if (selectedText) {
        setSelectedText(selectedText);
        const transform = selection.getRangeAt(0).getBoundingClientRect();
        setSelectedTextTransform({
          top: transform.top,
          bottom: transform.bottom,
        });

        setShowDialogBox(true);
      }
    }
  }

  useEffect(() => {
    document.addEventListener("mouseup", handleTextSelection);

    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
    };
  }, []);

  const [showDialogBox, setShowDialogBox] = useState(false);

  const handleSaveNotes = ({ selectedText, userNotes }) => {
    setUserNotesList((prevNotesList) => [
      ...prevNotesList,
      { selectedText, userNotes },
    ]);
    setShowNoteDialog(false);
  };

  const addNote = () => {
    setShowNoteDialog(true);
    closeDialogBox();
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogBoxOpen, setIsDialogBoxOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setisAddModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const openAddModal = () => {
    setisAddModalOpen(true);
    setIsDialogOpen(true);
    setIsDialogBoxOpen(true);
  };

  const closeAddModal = () => {
    setisAddModalOpen(false);
    setIsDialogOpen(false);
  };

  useEffect(() => {
    const popup = document.querySelector(".pdf_edit_table_popup");

    if (popup) {
      const numColumns = Object.keys(selectedPolicy || {}).length;
      const newWidth = 500 + numColumns * 50;
      popup.style.width = `${newWidth}px`;
    }
  }, [selectedPolicy]);

  const [editedPolicy, setEditedPolicy] = useState({
    policyName: "",
    rating: "",
    comment: "",
  });

  const [editedData, setEditedData] = useState([]);

  const policyDetails = [
    { label: "Policy Title", value: "Equal Opportunity Policy" },
    { label: "Policy Company", value: "TATA" },
    { label: "Policy Version", value: "1" },
    { label: "Policy Created At", value: "11/10/2023" },
    { label: "Policy Updated At", value: "01/12/2023" },
    { label: "Policy Scope", value: "IT Sector" },
    { label: "Policy Consulted by", value: "Consultant 1" },
  ];



  const onClickDeleteRow = (index) => {
    const updatedData = editedData.filter((policy, idx) => idx !== index);
    setEditedData(updatedData);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmitClick = () => {
    const index = editedData.findIndex((policy) => policy === selectedPolicy);

    if (index !== -1) {
      const updatedData = [...editedData];
      updatedData[index] = { ...selectedPolicy, ...editedPolicy };
      setEditedData(updatedData);
      console.log("Updated Data:", updatedData);
      setIsEditOpen(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPolicy((prevPolicy) => ({
      ...prevPolicy,
      [name]: value,
    }));
  };

  const handleEditClick = (policy) => {
    setIsModalOpen(true);
    setSelectedPolicy(policy);

    setEditedPolicy({
      policyName: policy.Name,
      policyScore: policy.Score,
      policyComments: policy.Comments,
    });
  };

  const handleDeleteNote = (index) => {
    const updatedNotesList = [...userNotesList];
    updatedNotesList.splice(index, 1);
    setUserNotesList(updatedNotesList);
  };

  const { documentUrl } = useParams();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const decodedDocumentUrl = searchParams.get("document");
    console.log("Doc Url:", decodedDocumentUrl);
  }, [location.search]);

  console.log("Location search:", location.search);

  const onDocumentLoadError = (error) => {
    console.error("Error loading document:", error.message);
  };



  const userType = "consultant";
  return (
    <>
      <Nav />
      <div className="pdfview-container">
        {showDialogBox && (
          <DialogBox onClose={closeDialogBox} onAddNote={addNote} />
        )}

        {showNoteDialog && (
          <NoteDialog
            isOpen={showNoteDialog}
            onClose={() => setShowNoteDialog(false)}
            onSave={handleSaveNotes}
            selectedText={selectedText}
          />
        )}
        <div className="pdfview-toolbar">
          <div className="pdfview_toggler">
            <label
              className="pdfview_icon_label"
              onClick={() => toggleView("pagination")}
            >
              <FaRegFilePdf
                className={`pdfview_icon pdfview_card_icon ${
                  viewType === "pagination" ? "pdfview_selected_icon" : ""
                }`}
              />
            </label>
            {/* <label
              className="pdfview_icon_label"
              onClick={() => toggleView("scrollbar")}
            >
              <MdOutlinePictureAsPdf
                className={`pdfview_icon pdfview_grid_icon ${
                  viewType === "scrollbar" ? "pdfview_selected_icon" : ""
                }`}
              />
            </label> */}
          </div>

          <div class="pdf_zoom_buttons_container">
            <button
              className={`pdf_zoom_icon ${
                viewType === "zoomIn" ? "pdf_selected_icon" : ""
              }`}
              onClick={() => handleZoomIn()}
            >
              <FaCirclePlus
                className="pdf-icon pdf_zoom_in_icon"
                style={{
                  fontWeight: "normal",
                }}
              />
            </button>
            <button
              className={`pdf_zoom_icon ${
                viewType === "zoomOut" ? "pdf_selected_icon" : ""
              }`}
              onClick={() => handleZoomOut()}
            >
              <FaCircleMinus className="pdf-icon pdf_zoom_out_icon" />
            </button>
          </div>
          <div className="pdfview-divider"></div>

          <div style={{ marginRight: 20, cursor: "default", marginTop: "5px" }}>
            <span style={{ whiteSpace: "nowrap" }}>
              Page {pageNumber} of {numPages}
            </span>
          </div>
        </div>

        <div
          className={`pdfview_container_sidebar ${
            isExtended ? "extended" : ""
          }`}
        >
          <CustomTooltip tooltipText="Comments">
            <PiNoteThin
              className="pdfview_note_icon"
              onClick={handleNotesIconClick}
            />
          </CustomTooltip>

          {isExtended && (
            <div className="extended-content">
              {userNotesList.length > 0 ? (
                <ul>
                  {userNotesList.map((note, index) => (
                    <li key={`note_${index}`} className="pdfview_note-item">
                      <div>
                        <strong>Comment {index + 1}:</strong> {note.userNotes}
                      </div>
                      <div>
                        <strong>Selected Text:</strong> {note.selectedText}
                        <button
                          className="pdfview_delete-note-button"
                          onClick={() => handleDeleteNote(index)}
                        >
                          <MdOutlineDelete />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No Comments</p>
              )}
            </div>
          )}
        </div>

        <div className="pdfview_content_container">
          {/* {viewType === "pagination" && (
            <div
              className="pdfview_pagination"
              style={{ marginLeft: isExtended ? "160px" : "0px" }}
            >
              {documentUrl && (
              <Document file={decodeURIComponent(documentUrl)}
              onLoadSuccess={onDocumentLoadSuccess} >
                <Page
                  pageNumber={pageNumber}
                  height={0}
                  width={919}
                  scale={scale}
                />
                // file={"/Sample.pdf"}
              </Document>
              )}
            </div>
          )} */}

          {viewType === "pagination" && (
            <div className="pdfview_pagination">
              <Document
                file={documentUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
              >
                <Page
                  pageNumber={pageNumber}
                  height={0}
                  width={919}
                  scale={scale}
                />
              </Document>
            </div>
          )}

          {viewType === "pagination" && (
            <>
              {pageNumber > 1 && (
                <button
                  className="pdfview_previous_icon"
                  onClick={() => changePage(-1)}
                >
                  <GrPrevious />
                </button>
              )}
              {pageNumber < numPages && (
                <button
                  className="pdfview_next_icon"
                  onClick={() => changePage(1)}
                >
                  <GrNext />
                </button>
              )}
            </>
          )}

          {/* {viewType === "scrollbar" && (
            <div
              className="pdfview_scrollbar"
              style={{ marginLeft: isExtended ? "160px" : "0px" }}
            >
              <Document
                file="/Sample.pdf"
                onLoadSuccess={onDocumentLoadSuccess}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    height={800}
                    width={925}
                    scale={scale}
                  />
                ))}
              </Document>
            </div>
          )} */}
        </div>

        <div className={`pdf_sidebar${isDialogOpen ? " dialog-open" : ""}`}>
          <div className="pdf-content-container">
            <FaUserLarge
              className="pdf_sidebar_heading_icon"
              style={{ marginRight: "5px" }}
            />
            <p className="pdf_sidebar_heading" style={{ marginRight: "175px" }}>
              Consultant Workspace
            </p>
          </div>
          <div className="pdf_sidebar_content">
            {/* <h2
              style={{
                position: "relative",
                top: 80,
                fontWeight: "normal",
                marginBottom: "10px",
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <BiDetail
                className="pdf_sidebar_heading_icon"
                style={{
                  marginRight: "10px",
                  color: "black",
                  fontSize: "20px",
                }}
              />
              Policy Details
            </h2>
            <div className="policy-details-container">
              <table className="policy-details-container-table">
                <tbody>
                  {policyDetails.map((detail, index) => (
                    <tr key={index}>
                      <td
                        className={
                          detail.label === "Policy Title"
                            ? "policy-title-cell"
                            : ""
                        }
                      >
                        <strong>{detail.label}:</strong>
                      </td>
                      <td>{detail.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> */}
            <h2
              style={{
                position: "relative",
                top: 80,
                fontWeight: "normal",
                marginBottom: "10px",
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <BiDetail
                className="pdf_sidebar_heading_icon"
                style={{
                  marginRight: "10px",
                  color: "black",
                  fontSize: "20px",
                }}
              />
              Policy Details
            </h2>
            <div className="policy-details-container">
              <table className="policy-details-container-table">
                <tbody>
                  {policyDetails.map((detail, index) => (
                    <tr key={index}>
                      <td
                        className={
                          detail.label === "Policy Title"
                            ? "policy-title-cell"
                            : ""
                        }
                      >
                        <strong>{detail.label}:</strong>
                      </td>
                      <td>{detail.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pdf_table">
              <h2>
                Policy Fulfillment
                {userRole !== "Company" && (
                  <button className="pdf_edit_button" onClick={openAddModal}>
                    <FiPlus />
                  </button>
                )}
              </h2>
            </div>

            {isAddModalOpen && (
              <div className="pdf-popup-table-overlay">
                <div className="pdf_edit_table_popup">
                  <div className="custom-modal-overlay" onClick={closeModal}>
                    <div
                      className="custom-modal"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="pdf-table-container">
                        <div className="pdf-popup-overlay">
                          <div className="pdf_edit_popup">
                            <h2 className="pdf_table_pop_heading">
                              Add Reviews
                            </h2>
                            <button
                              className="pdf-close-button"
                              onClick={closeAddModal}
                            >
                              <RxCross2 />
                            </button>

                            <label htmlFor="editedCompany">Score:</label>
                            <input
                              type="text"
                              id="editedCompany"
                              name="rating"
                              value={editedPolicy.rating}
                              onChange={handleInputChange}
                            />

                            <label htmlFor="editedVersion">Comments:</label>
                            <input
                              type="text"
                              id="editedVersion"
                              name="comment"
                              value={editedPolicy.comment}
                              onChange={handleInputChange}
                            />
                            <div className="company-profile-rating-popup__buttons">
                              <button
                                type="submit"
                                onClick={handleSubmitReviews}
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isModalOpen && (
              <div className="pdf-popup-table-overlay">
                <div className="pdf_edit_table_popup">
                  <div className="custom-modal-overlay" onClick={closeModal}>
                    <div
                      className="custom-modal"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="pdf-table-container">
                        <div className="pdf-popup-overlay">
                          <div className="pdf_edit_popup">
                            <h2 className="pdf_table_pop_heading">
                              Edit Policy
                            </h2>

                            <button
                              className="pdf-close-button"
                              onClick={closeModal}
                            >
                              <RxCross2 />
                            </button>

                            {/* <label htmlFor="editedTitle">Policy Name:</label>
                            <input
                              type="text"
                              id="editedTitle"
                              name="policyName"
                              value={editedPolicy.policyName}
                              onChange={handleInputChange}
                            /> */}

                            <label htmlFor="editedCompany">Score:</label>
                            <input
                              type="text"
                              id="editedCompany"
                              name="policyScore"
                              value={editedPolicy.policyScore}
                              onChange={handleInputChange}
                            />

                            <label htmlFor="editedVersion">Comments:</label>
                            <input
                              type="text"
                              id="editedVersion"
                              name="policyComments"
                              value={editedPolicy.policyComments}
                              onChange={handleInputChange}
                            />
                            <div className="company-profile-rating-popup__buttons">
                              <button type="submit" onClick={handleSubmitClick}>
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <table>
              <thead>
                <tr>
                  <th>Score</th>
                  <th>Comments</th>
                  {userRole !== "Company" && <th>Edit</th>}
                </tr>
              </thead>
              <tbody>
                {editedData.map((policy, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                      }}
                    >
                      {policy.rating}
                    </td>
                    <td
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                      }}
                    >
                      {policy.comment}
                    </td>
                    {userRole !== "Company" && (
                      <td>
                        <BiSolidPencil
                          onClick={() => handleEditReviews(policy)}
                          style={{
                            marginRight: "5px",
                            cursor: "pointer",
                          }}
                        />
                        <AiFillDelete
                          onClick={() => deleteReview(index)}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default PdfViewer;
