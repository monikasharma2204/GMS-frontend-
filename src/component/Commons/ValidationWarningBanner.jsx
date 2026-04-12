import { Box, Typography } from "@mui/material";
import { useId } from "react";

const defaultBannerSx = {
  position: "absolute",
  top: "37px",
  right: "-9px",
  width: "395px",
  height: "42px",
  backgroundColor: "#EA3D2F",
  borderRadius: "2px",
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
  zIndex: 9,
  gap: "10px",
  boxShadow: "rgba(0, 0, 0, 0.1)",
};

const ValidationWarningBanner = ({
  show,
  message = "Please complete all required fields.",
  sx,
}) => {
  const rawId = useId();
  const maskId = `gms-val-warn-mask-${rawId.replace(/:/g, "")}`;

  if (!show) return null;

  return (
    <Box
      sx={{
        ...defaultBannerSx,
        ...sx,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path
          d="M8.99944 10.125V6.74998M3.57582 15.1875H14.4231C15.2758 15.1875 15.8181 14.2762 15.4125 13.5264L9.98888 3.51392C9.56307 2.72811 8.43582 2.72811 8.01001 3.51392L2.58694 13.5264C2.18025 14.2762 2.72307 15.1875 3.57582 15.1875Z"
          stroke="white"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <mask id={maskId} style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="8" y="11" width="2" height="2">
          <path
            d="M9 11.5C9.15747 11.5 9.30857 11.5625 9.41992 11.6738C9.53127 11.7852 9.59375 11.9363 9.59375 12.0938C9.59375 12.2512 9.53127 12.4023 9.41992 12.5137C9.30857 12.625 9.15747 12.6875 9 12.6875C8.84253 12.6875 8.69143 12.625 8.58008 12.5137C8.46873 12.4023 8.40625 12.2512 8.40625 12.0938C8.40625 11.9363 8.46873 11.7852 8.58008 11.6738C8.69143 11.5625 8.84253 11.5 9 11.5Z"
            fill="white"
            stroke="white"
            strokeWidth="0.5"
          />
        </mask>
        <g mask={`url(#${maskId})`}>
          <path
            d="M9.84375 12.0938C9.84375 12.3175 9.75485 12.5321 9.59662 12.6904C9.43839 12.8486 9.22378 12.9375 9 12.9375C8.77622 12.9375 8.56161 12.8486 8.40338 12.6904C8.24514 12.5321 8.15625 12.3175 8.15625 12.0938C8.15625 11.87 8.24514 11.6554 8.40338 11.4971C8.56161 11.3389 8.77622 11.25 9 11.25C9.22378 11.25 9.43839 11.3389 9.59662 11.4971C9.75485 11.6554 9.84375 11.87 9.84375 12.0938Z"
            fill="#666666"
            stroke="white"
          />
        </g>
      </svg>
      <Typography
        sx={{
          color: "#ffffff",
          fontFamily: "Calibri",
          fontSize: "16px",
          letterSpacing: "0px",
          lineHeight: "normal",
          fontWeight: 700,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default ValidationWarningBanner;
