import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import actions from "../store/actions";
import { useNavigate } from "react-router-dom";
import FormPageInput from "../components/FormPageInput";
import { setCurrentWindowId } from "../store/reducers/window.reducer";

export default function FormPageConfirmation() {
  const [submissionDate, setSubmissionDate] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const windows = useSelector((store) => store.allWindows);
  const frameTypes = useSelector((store) => store.frames);


  const editWindow = (window) => {
    dispatch(setCurrentWindowId(Number(window.id)));
    navigate("/form/4");
  };

  const getFrameType = (frameId) => {
    return frameTypes.find((frame) => frame.id == frameId);
  };
  const sendConfirmationEmail = () => {
    // Send the confirmation email;
    dispatch(actions.sendConfirmationEmail());
    // Get the current date and time
    const currentDate = new Date();
    // Update the submissionDate state with the current date and time 
    setSubmissionDate(currentDate);

    navigate("/form/6")
  };
  return (
    <>
      <div className="card w-102 bg-base-100 shadow-xl p-2 m-2">
        <h2 className="card-title justify-center">
          Please review your windows:
        </h2>
        {windows.map((window) => (
          <div
            className="card w-102 bg-base-100 shadow-xl border-solid border-2 p-2 m-2"
            key={window.id}
          >
            <figure>
              <img
                src={`https://painless-panes.s3.amazonaws.com/${window.image}`}
                alt="window!"
              />
            </figure>
            <div className="card-body items-center text-center">
              <p>Height: {window.height}</p>
              <p>Width: {window.width}</p>
              {/* <p>Desired frame: {getFrameType(window.desired_frame_id).name}</p> */}
            </div>
            <div className="card-actions justify-end">
              <button
                className="btn btn-sm"
                onClick={() => {
                  editWindow(window);
                }}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
        <div className="card-body">
          <div className="card-actions justify-center">
            <button className="btn btn-primary" onClick={sendConfirmationEmail}>Submit</button>
            {submissionDate && (
              <p>Submission Date: {submissionDate.toLocaleString()}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
