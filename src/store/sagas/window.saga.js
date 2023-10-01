import axios from "axios";
import { put, select, takeLatest } from "redux-saga/effects";
import { setAllWindows, setCurrentWindowId } from "../reducers/window.reducer";

// action types
export const GET_ALL_WINDOWS = "GET_ALL_WINDOWS";
export const ADD_WINDOW = "ADD_WINDOW";
export const UPDATE_WINDOW_DIMENSIONS = "UPDATE_WINDOW_DIMENSIONS";
export const ADD_WINDOW_PHOTO = "ADD_WINDOW_PHOTO";
export const UPDATE_WINDOW_FRAME = "UPDATE_WINDOW_FRAME";

// action functions
export const getAllWindows = (payload) => {
  return { type: GET_ALL_WINDOWS, payload };
};

export const addWindow = (payload) => {
  return { type: ADD_WINDOW, payload };
};

export const updateWindowDimensions = (payload) => {
  return { type: UPDATE_WINDOW_DIMENSIONS, payload };
};

export const addWindowPhoto = (payload) => {
  return { type: ADD_WINDOW_PHOTO, payload };
};

export const updateWindowFrame = (payload) => {
  return { type: UPDATE_WINDOW_FRAME, payload };
};

// action worker sagas
export function* getAllWindowsSaga(action) {
  const project_id = action.payload.project_id;
  try {
    const response = yield axios.get(`/api/window/${project_id}`);
    const windows = yield response.data;
    console.log("Received window list:", windows);
    yield put(setAllWindows(windows));

    // If the currentWindowId is null, set it to the last window in he list
    const currentWindowId = yield select((store) => store.currentWindowId);
    if (currentWindowId === null) {
      const lastWindowId = Math.max(...windows.map((window) => window.id));
      yield put(setCurrentWindowId(lastWindowId));
    }
  } catch (error) {
    console.error(error);
  }
}

export function* addWindowSaga(action) {
  const project_id = action.payload.project_id;
  try {
    const windowIdResponse = yield axios.post(
      `/api/window/${project_id}`,
      project_id
    );
    // id of the created window
    const windowId = yield windowIdResponse.data.id;
    console.log("WINDOW ID --> ", windowId);
    yield put(setCurrentWindowId(windowId));
  } catch (error) {
    console.error(error);
  }
}

// generator function to POST an image to AWS S3, then PUT
// an update to the current window, updating the image column
// with the AWS suffix
export function* addWindowPhotoSaga(action) {
  try {
    // folder/file of the bucket the image is stored in
    const windowPathResponse = yield axios.post(
      `/api/window/photoUpload/aws`,
      // payload is the formData object from AddImage
      action.payload
    );
    // handles the updating of the image
    const currentWindowId = yield select((store) => store.currentWindowId);
    yield axios.put(`/api/window/${currentWindowId}/image`, windowPathResponse);
  } catch (error) {
    console.error(error);
  }
}

export function* updateWindowDimensionsSaga(action) {
  const { currentWindowId, imageWidth, imageHeight } = action.payload;
  try {
    const heightResponse = yield axios.put(
      `/api/window/${currentWindowId}/height`,
      { height: imageHeight }
    );
    const widthResponse = yield axios.put(
      `/api/window/${currentWindowId}/width`,
      {
        width: imageWidth,
      }
    );
    // console.log("Updated window dimensions:", heightResponse, widthResponse);
  } catch (error) {
    console.error("Failed to update window dimensions:", error);
  }
}

export function* updateWindowFrameSaga(action) {
  const currentWindowId = action.payload.currentWindowId;
  const frameId = action.payload.frameType;
  try {
    const response = yield axios.put(
      `/api/window/${currentWindowId}/desired_frame_id`,
      { desiredFrameId: frameId }
    );
  } catch (error) {
    console.error(error);
  }
}

// watcher saga
export function* windowSaga() {
  yield takeLatest(GET_ALL_WINDOWS, getAllWindowsSaga);
  yield takeLatest(ADD_WINDOW, addWindowSaga);
  yield takeLatest(UPDATE_WINDOW_DIMENSIONS, updateWindowDimensionsSaga);
  yield takeLatest(ADD_WINDOW_PHOTO, addWindowPhotoSaga);
  yield takeLatest(UPDATE_WINDOW_FRAME, updateWindowFrameSaga);
}
