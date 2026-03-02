import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useRecoilState } from "recoil";
import { isEditingState } from "recoil/state/CommonState";

const PictureProfileImport = (props) => {
  const [isEditing, setIsEditing] = useRecoilState(isEditingState);
  const [image, setImage] = useState(null);
  const [imageChoose, setImageChoose] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, JPG, or PNG only)');
      event.target.value = ''; // Clear the input
      return;
    }

    // Validate file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      event.target.value = ''; // Clear the input
      return;
    }

    const reader = new FileReader();
    props.handleImageValue(file)

    reader.onloadend = () => {
      setImage(reader.result);
      setImageChoose(reader.result)
    };

    reader.readAsDataURL(file);
  };
  useEffect(()=>{
    if(!imageChoose){
      console.log('ddd')
      setImage(props.defaultValue)
    }else{
      setImage(imageChoose)

    }
  },[image,props.defaultValue])

  return (
    <Box>
      <label htmlFor="image-upload">
        <Box
          sx={{
            width: image ? "152px" : "146px",
            height: "150px",
            backgroundColor: "#FFF",
            borderRadius: "4px",
            border: image ? "none" : "3px dashed var(--Line-Table, #C6C6C8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          {props.defaultValue ? (
            <>
              <img
                src={image}
                alt="Selected"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "4px",
                }}
              />
            </>
          ) : (
            <Box sx={{ textAlign: "center" }}>
              <Box sx={{ marginLeft: "3px"}}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="42"
                  height="43"
                  viewBox="0 0 52 53"
                  fill="none"
                >
                  <path
                    d="M51.5867 8.36842V13.9474H43.4414V22.3158H38.0112V13.9474H29.866V8.36842H38.0112V0H43.4414V8.36842H51.5867ZM28.5084 27.8947C29.5889 27.8944 30.625 27.453 31.3888 26.6678C32.1525 25.8826 32.5814 24.8178 32.5811 23.7077C32.5807 22.5976 32.1511 21.5332 31.3869 20.7485C30.6226 19.9638 29.5862 19.5232 28.5057 19.5235C27.9707 19.5237 27.441 19.6322 26.9468 19.8427C26.4526 20.0532 26.0035 20.3617 25.6254 20.7504C25.2472 21.1392 24.9472 21.6008 24.7427 22.1087C24.5381 22.6165 24.4329 23.1609 24.4331 23.7105C24.4333 24.2602 24.5388 24.8044 24.7437 25.3122C24.9486 25.8199 25.2488 26.2812 25.6273 26.6698C26.0057 27.0583 26.4549 27.3665 26.9493 27.5767C27.4436 27.7868 27.9734 27.8949 28.5084 27.8947ZM38.0112 36.9159L36.6184 35.3259C36.1091 34.7433 35.4862 34.2774 34.7902 33.9585C34.0941 33.6395 33.3405 33.4747 32.5783 33.4747C31.8162 33.4747 31.0626 33.6395 30.3665 33.9585C29.6705 34.2774 29.0475 34.7433 28.5383 35.3259L26.7572 37.365L13.5754 22.3158L5.43018 31.6131V13.9474H24.4358V8.36842H5.43018C3.99 8.36842 2.60882 8.9562 1.59046 10.0025C0.572106 11.0487 0 12.4677 0 13.9474V47.4211C0 48.9007 0.572106 50.3197 1.59046 51.366C2.60882 52.4122 3.99 53 5.43018 53H38.0112C39.4514 53 40.8326 52.4122 41.8509 51.366C42.8693 50.3197 43.4414 48.9007 43.4414 47.4211V27.8947H38.0112V36.9159Z"
                    fill="#BFBFBF"
                  />
                </svg>
              </Box>

              <Typography
                sx={{
                  color: "var(--black, #000)",
                  textAlign: "center",
                  fontFamily: "Calibri",
                  fontSize: "12px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                  marginTop: "6px",
                }}
              >
                Drop your Image
              </Typography>
              <Typography
                sx={{
                  color: "#909090",
                  textAlign: "center",
                  fontFamily: "Calibri",
                  fontSize: "10px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                }}
              >
                JPEC or PNGs Only
              </Typography>
            </Box>
          )}
        </Box>
      </label>
      {isEditing && (
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleImageUpload}
          style={{ display: "none" }}
          id="image-upload"
        />
      )}
    </Box>
  );
};

export default PictureProfileImport;
