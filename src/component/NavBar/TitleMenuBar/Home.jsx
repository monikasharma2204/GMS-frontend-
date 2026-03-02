import React from "react";
import { Box, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  TextButton,
  ButtonOnNavBarWithOutRightArrow,
  SidebarMenuBox,
} from "../../../Assets/styles/NavbarStyles.jsx";

const Home = () => {
  const location = useLocation();
  const isActive = location.pathname === "/home" || location.pathname === "/";

  return (
    <Box>
      <Box
        sx={[
          SidebarMenuBox,
          isActive && {
            ".hovered-text": {
              color: "#fff",
            },
            ".hovered-svg path": {
              stroke: "#fff",
            },
          },
        ]}
        className="sidebar-menu-box"
      >
        <svg
          className="hovered-svg"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="19"
          viewBox="0 0 24 25"
          fill="none"
        >
          <path
            d="M14.206 15.3074V21.5463C14.2059 21.6715 14.2274 21.7955 14.2693 21.9112C14.3112 22.0269 14.3726 22.1321 14.4501 22.2206C14.5277 22.3092 14.6197 22.3795 14.721 22.4274C14.8223 22.4753 14.9309 22.5 15.0406 22.5H18.8134C18.9231 22.5001 19.0318 22.4755 19.1332 22.4277C19.2346 22.3798 19.3268 22.3095 19.4043 22.2209C19.4819 22.1324 19.5435 22.0272 19.5854 21.9114C19.6274 21.7957 19.6489 21.6716 19.6488 21.5463V13.7682H20.7434C21.0006 13.768 21.2515 13.6779 21.4624 13.5099C21.6732 13.3419 21.8339 13.1041 21.9227 12.8286C22.0115 12.5531 22.0241 12.2531 21.9589 11.9692C21.8937 11.6852 21.7538 11.4309 21.558 11.2406L12.9977 2.91891C12.7195 2.6485 12.3661 2.5 12.0007 2.5C11.6353 2.5 11.2819 2.6485 11.0037 2.91891L2.44336 11.2406C2.24715 11.4307 2.10682 11.685 2.04134 11.9691C1.97586 12.2533 1.9884 12.5535 2.07726 12.8292C2.16612 13.1049 2.32701 13.3428 2.53818 13.5108C2.74934 13.6787 3.00059 13.7686 3.25795 13.7682H4.35259V21.5473C4.3528 21.8 4.44091 22.0424 4.59755 22.221C4.75419 22.3997 4.96656 22.5 5.18798 22.5H8.96001C9.18136 22.5 9.39364 22.3996 9.55015 22.2209C9.70667 22.0423 9.7946 21.7999 9.7946 21.5473V15.3083L14.206 15.3074Z"
            stroke={isActive ? "#fff" : "rgba(255, 255, 255, 0.48)"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <Link
          to="/home"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Typography
            className="hovered-text"
            sx={[
              TextButton,
              isActive && {
                color: "#fff",
              },
            ]}
          >
            Home
          </Typography>
        </Link>
      </Box>
    </Box>
  );
};

export default Home;
