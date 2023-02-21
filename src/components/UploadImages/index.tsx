import { useState } from "react";

import UploadService from "../../services/file-upload.service";

interface UploadedImage{
    url:string;
    name:string;
}

const UploadImages = () => {
  const [currentFile, setCurrentFile] = useState();
  const [previewImage, setPreviewImage] = useState();
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  const [imageInfos, setImageInfos] = useState<UploadedImage[]>([]);

  const selectFile = (event: any) => {
    setCurrentFile(event.target.files[0]);
    // setPreviewImage(URL.createObjectURL(event.target.files[0]))
    setProgress(0);
    setMessage("");
  };

  const upload = () => {
    setProgress(0);

    UploadService.upload(
      currentFile!,
      (event: { loaded: number; total: number }) => {
        setProgress(Math.round((100 * event.loaded) / event.total));
      }
    )
      .then((response) => {
        setMessage(response.data.message);
        return UploadService.getFiles();
      })
      .then((files) => {
        setImageInfos(files.data);
      })
      .catch((err) => {
        setProgress(0);
        setMessage("Could not upload the image!");
        setCurrentFile(undefined);
      });
  };

  return <div>
  <div className="row">
    <div className="col-8">
      <label className="btn btn-default p-0">
        <input type="file" accept="image/*" onChange={selectFile} />
      </label>
    </div>

    <div className="col-4">
      <button
        className="btn btn-success btn-sm"
        disabled={!currentFile}
        onClick={upload}
      >
        Upload
      </button>
    </div>
  </div>

  {currentFile && (
    <div className="progress my-3">
      <div
        className="progress-bar progress-bar-info progress-bar-striped"
        role="progressbar"
        aria-valuenow={progress}
        // aria-valuemin="0"
        // aria-valuemax="100"
        style={{ width: progress + "%" }}
      >
        {progress}%
      </div>
    </div>
  )}

  {previewImage && (
    <div>
      <img className="preview" src={previewImage} alt="" />
    </div>
  )}

  {message && (
    <div className="alert alert-secondary mt-3" role="alert">
      {message}
    </div> 
  )}

  <div className="card mt-3">
    <div className="card-header">List of Images</div>
    <ul className="list-group list-group-flush">
      {imageInfos &&
        imageInfos.map((img, index) => (
          <li className="list-group-item" key={index}>
            <a href={img.url}>{img.name}</a>
          </li>
        ))}
    </ul>
  </div>
</div>;
};

export default UploadImages;
