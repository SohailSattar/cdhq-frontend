import { FC, useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import Button from "../Button";

import styles from "./styles.module.scss";

interface Props {
  maxNumber?: number;
}

const ImageUploader: FC<Props> = ({ maxNumber = 1 }) => {
  const [images, setImages] = useState([]);

  const onChange = (images: ImageListType, addUpdateIndex: number[] | undefined) => {
    // data for submit
    console.log(images, addUpdateIndex);

    if (maxNumber === 1) {
      // setImages
    }

    setImages(images as never[]);
  };

  return (
    <div>
      <ImageUploading
        // multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className={styles.imageUploader}>
            <div className={styles.topContainer}>
              <Button
                style={isDragging ? { color: "red" } : undefined}
                onClick={onImageUpload}
                {...dragProps}
              >
                Click or Drop here
              </Button>
              &nbsp;
              <Button onClick={onImageRemoveAll}>Remove all images</Button>
            </div>
            {imageList.map((image, index) => (
              <div key={index}>
                <img
                  src={image["data_url"]}
                  alt=""
                  width="100%"
                  className={styles.imageItem}
                />
                <div className={styles.bottomContainer}>
                  <Button onClick={() => onImageUpdate(index)}>Update</Button>
                  &nbsp;
                  <Button onClick={() => onImageRemove(index)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    </div>
  );
};

export default ImageUploader;
