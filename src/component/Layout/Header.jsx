import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
const Header = () => {

  const navigate = useNavigate()


  const handlLogout = () => {
    navigate('/login')
  }
  return (
    <>
      <Box sx={{
        padding: "10px 0px", width: "100%", backgroundColor: "#062C30", position: "sticky",
        top: "0px",
        left: "0px",
        zIndex: "99"
      }}>


        <Box
          sx={{
            // width: "1683px", //old 1697px
            // width: "100%",
            padding: "0 16px",
            // height: "72px",
            flexShrink: 0,

            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

          }}
        >
          <Box
            sx={{
              maxWidth: "372px",
              width: "100%",
              padding: "16px 8px",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Typography
              sx={{
                color: "#FFF",
                fontFamily: "Calibri",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "20px",
              }}
            >
              help
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>

            <Box sx={{ height: "52px", width: "92px", display: "flex", alignItems: "center", justifyContent: "center", }}>
              {/* <Box sx={{  width: "46px" , height: "52px" , justifyContent: "center", alignItems: "center" , display: "flex" }}>

          
              </Box> */}

              <Box sx={{ height: "52px", width: "46px", display: "flex", alignItems: "center", justifyContent: "center", }}>
                <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "0px 8px", }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_21786_17)">
                      <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F0F0F0" />
                      <path d="M2.74219 4.36368H21.2563C20.5725 3.53563 19.7794 2.80134 18.8996 2.18188H5.09892C4.21913 2.80124 3.42605 3.53559 2.74219 4.36368Z" fill="#F0F0F0" />
                      <path d="M0 12.0001C0 12.3679 0.0174844 12.7315 0.049875 13.091H23.9501C23.9825 12.7315 24 12.3679 24 12.0001C24 11.6322 23.9825 11.2686 23.9501 10.9092H0.049875C0.0174844 11.2686 0 11.6322 0 12.0001H0Z" fill="#F0F0F0" />
                      <path d="M1.30786 17.4545H22.6907C23.0441 16.7632 23.3323 16.0333 23.5474 15.2727H0.451172C0.666281 16.0333 0.954563 16.7633 1.30786 17.4545Z" fill="#F0F0F0" />
                      <path d="M5.09892 21.8183H18.8995C19.7793 21.1988 20.5725 20.4645 21.2563 19.6365H2.74219C3.42605 20.4644 4.21913 21.1988 5.09892 21.8183Z" fill="#F0F0F0" />
                      <path d="M0.451172 8.72721H23.5475C23.3324 7.96652 23.0441 7.23658 22.6908 6.54541H1.30791C0.954609 7.23658 0.666328 7.96652 0.451172 8.72721Z" fill="#F0F0F0" />
                      <path d="M5.74023 2.1818H18.9014C16.9495 0.807516 14.5697 0 12.0011 0C10.4359 0 7.69211 0.807516 5.74023 2.1818Z" fill="#D80027" />
                      <path d="M11.4785 6.54557H22.6917C22.2926 5.76496 21.8107 5.03375 21.2573 4.36377H11.4785V6.54557Z" fill="#D80027" />
                      <path d="M11.4785 10.9091H23.9504C23.8829 10.1599 23.7472 9.43037 23.5484 8.72729H11.4785V10.9091Z" fill="#D80027" />
                      <path d="M0.452781 15.2729H23.549C23.7479 14.5698 23.8835 13.8402 23.951 13.0911H0.0507812C0.118281 13.8402 0.253937 14.5698 0.452781 15.2729Z" fill="#D80027" />
                      <path d="M2.74297 19.6364H21.2571C21.8105 18.9663 22.2924 18.2352 22.6915 17.4546H1.30859C1.70764 18.2352 2.18961 18.9664 2.74297 19.6364Z" fill="#D80027" />
                      <path d="M11.9999 23.9999C14.5685 23.9999 16.9484 23.1924 18.9003 21.8181H5.09961C7.05148 23.1924 9.43133 23.9999 11.9999 23.9999Z" fill="#D80027" />
                      <path d="M0.452734 8.72728C0.253891 9.43041 0.118281 10.1599 0.0507812 10.9091H12.0009V0C6.50809 0 1.87736 3.69056 0.452734 8.72728Z" fill="#0052B4" />
                      <path d="M7.14308 3.13037L7.92003 5.5217H10.4347L8.40041 6.99976L9.17731 9.39123L7.14308 7.91326L5.10875 9.39123L5.88584 6.99976L3.85156 5.5217H6.36608L7.14308 3.13037Z" fill="#F0F0F0" />
                    </g>
                    <defs>
                      <clipPath id="clip0_21786_17">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </Box>

              </Box>



              <Box
                sx={{
                  "&:hover svg path": {
                    fill: "#FFF"
                  },
                  height: "52px", width: "46px", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >

                <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "0px 8px", }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.2676 21C10.4431 21.304 10.6956 21.5565 10.9996 21.732C11.3037 21.9075 11.6485 21.9999 11.9996 21.9999C12.3506 21.9999 12.6955 21.9075 12.9995 21.732C13.3036 21.5565 13.556 21.304 13.7316 21" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3.26127 15.326C3.13063 15.4692 3.04442 15.6472 3.01312 15.8385C2.98183 16.0298 3.00679 16.226 3.08498 16.4034C3.16316 16.5807 3.2912 16.7316 3.45352 16.8375C3.61585 16.9434 3.80545 16.9999 3.99927 17H19.9993C20.1931 17.0001 20.3827 16.9438 20.5451 16.8381C20.7076 16.7324 20.8358 16.5817 20.9142 16.4045C20.9926 16.2273 21.0178 16.0311 20.9867 15.8398C20.9557 15.6485 20.8697 15.4703 20.7393 15.327C19.4093 13.956 17.9993 12.499 17.9993 8C17.9993 6.4087 17.3671 4.88258 16.2419 3.75736C15.1167 2.63214 13.5906 2 11.9993 2C10.408 2 8.88185 2.63214 7.75663 3.75736C6.63141 4.88258 5.99927 6.4087 5.99927 8C5.99927 12.499 4.58827 13.956 3.26127 15.326Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>

                </Box>


              </Box>
            </Box>






            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 0px 8px 16px" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px", height: "36px", width: "140px", }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_21786_59)">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 20.662V19C7 18.4696 7.21071 17.9609 7.58579 17.5858C7.96086 17.2107 8.46957 17 9 17H15C15.5304 17 16.0391 17.2107 16.4142 17.5858C16.7893 17.9609 17 18.4696 17 19V20.662" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                  <defs>
                    <clipPath id="clip0_21786_59">
                      <rect width="24" height="24" rx="12" fill="white" />
                    </clipPath>
                  </defs>
                </svg>

                <Typography
                  sx={{
                    color: "#FFF",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "100%",

                  }}
                >
                  SuperAdmin
                </Typography>
              </Box>
            </Box>




            <Box onClick={handlLogout}

            >
              <Box sx={{ height: "52px", width: "46px", display: "flex", alignItems: "center", justifyContent: "center", }}>
                <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "0px 8px", }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.4003 6.6001C19.6569 7.8572 20.5132 9.45827 20.8611 11.2014C21.209 12.9445 21.0329 14.7516 20.3551 16.3948C19.6774 18.038 18.5282 19.4437 17.0525 20.4346C15.5769 21.4255 13.8408 21.9573 12.0634 21.9628C10.2859 21.9684 8.54654 21.4475 7.06471 20.4659C5.58288 19.4842 4.42491 18.0857 3.73684 16.4468C3.04876 14.8079 2.8614 13.002 3.19837 11.2567C3.53533 9.51145 4.38155 7.90505 5.63029 6.6401" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Box>

              </Box>


            </Box>

          </Box>
        </Box >

      </Box>
    </>
  );
};

export default Header;
