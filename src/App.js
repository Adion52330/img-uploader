import "./App.css";
import img from "./image.svg";
import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import storage from "./firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

function App() {
  const [imageAsset, setImageAsset] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    // check if files are jpeg/png or not
    const acceptedFile = acceptedFiles.filter(
      (file) => file.type === "image/jpeg" || file.type === "image/png"
    );
    // if files are not jpeg/png, then return
    if (acceptedFile.length === 0) {
      alert("Please upload only jpeg/png files");
      return;
    }
    console.log(acceptedFile);
    const file = acceptedFile[0];
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploading(true);
        setProgress(prog);
        if (prog === 100) {
          setUploading(false);
        }
      },
      (error) => {
        alert(error.message);
      },
      () => {
        getDownloadURL(storageRef).then((url) => {
          setImageAsset(url);
        });
        setUploaded(true);
      }
    );
  }, []);

  console.log(imageAsset);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  if (uploading) {
    return (
      <div className="App">
        <div className="p-5 px-10 border-2 shadow-lg rounded-md bg-white">
          <h1 className="text-[#4f4f4f] text-[18px] font-semibold">
            Uploading...
          </h1>
          <div className="flex justify-center mt-3 w-[340.71px]">
            <div className="w-full h-[6px] bg-gray-200 rounded-md">
              <div
                className="w-full h-[6px] bg-blue-500 transition rounded-md"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (uploaded) {
    return (
      <div className="App">
        <div className="p-5 px-10 w-[400.36px] border-2 shadow-lg space-y-4 rounded-md bg-white flex flex-col items-center justify-center">
          <h1 className="font-semibold text-[18px]">Uploaded Successfully</h1>
          <img src={imageAsset} className="w-full object-cover" alt="" />
          <div className="bg-[#f6f8fb] flex w-full rounded-lg items-center">
            <p className="text-[10px] text-[#4f4f4f] flex-1">
              {/* Show the link till 50 characters then ... */}
              {imageAsset.substring(0, 50)}
              {imageAsset.length > 50 && "..."}
            </p>
            <button
              className="cursor-pointer justify-end rounded-lg text-[10px] px-4 py-2 bg-[#2F80ED] active:bg-[#006eff] text-white"
              onClick={() => {
                // copy imageAsset
                navigator.clipboard.writeText(imageAsset);
              }}
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="p-5 px-10 border-2 shadow-lg rounded-md bg-white flex flex-col items-center justify-center">
        <h2 className="font-semibold text-[18px]">Upload your Image</h2>
        <p className="text-[10px] font-semibold text-[#828282]">
          File should be jpeg/png
        </p>
        <div
          className={`flex flex-col border-2 rounded-md px-10 mt-5 border-[#97BEF4] border-dashed items-center p-5 justify-center ${
            isDragActive && "border-2 border-solid border-blue-500"
          }`}
          {...getRootProps()}
        >
          <label
            htmlFor="file"
            className="flex flex-col items-center justify-center space-y-3"
          >
            <img src={img} alt="" />
            <p className="text-[#bdbdbd] text-[12px] font-semibold">
              Drag and Drop your image here
            </p>
          </label>
          <input
            type="file"
            className="opacity-0 absolute -z-1"
            onChange={(e) => {
              setImageAsset(e.target.files[0]);
              console.log(e.target.files[0]);
            }}
            id="file"
            accept="image/*"
            {...getInputProps()}
          />
        </div>
        <p className="font-semibold my-4">or</p>
        <div>
          <label htmlFor="file">
            <div className="cursor-pointer rounded-lg px-4 py-2 bg-[#2F80ED] active:bg-[#006eff] text-white">
              Choose File
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

export default App;
