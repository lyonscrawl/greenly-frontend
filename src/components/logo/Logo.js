import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Link } from '@mui/material';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  // OR using local (public folder)
  // -------------------------------------------------------
  // const logo = (
  //   <Box
  //     component="img"
  //     src="/logo/logo_single.svg" => your path
  //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
  //   />
  // );

  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 140,
        height: 65,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      <svg viewBox="0 0 560 144" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M513.245 71.2873L496.425 28.6157H468.282L500.921 98.5452L481.937 140.568H508.748L559.374 28.6157H532.562L513.245 71.2873Z" fill="#101010"/>
<path d="M467.253 115.045V94.0618H466.576C462.08 94.0618 460.082 91.7304 460.082 87.0675V3.1037H435.435V88.5663C435.435 105.219 445.094 115.045 461.58 115.045H467.253Z" fill="#101010"/>
<path d="M397.002 28.6147C389.592 28.6147 379.609 29.9472 374.613 38.9398V28.6149H350.133V115.044H374.613V64.419C374.613 53.428 381.107 47.5994 389.933 47.5994C397.094 47.5994 402.756 52.9284 402.756 62.9202V115.044H427.236V58.5904C427.236 39.1063 414.155 28.6147 397.002 28.6147Z" fill="#101010"/>
<path d="M208.666 95.2925C198.841 95.2925 192.18 90.078 190.848 77.1208H249.633C249.799 75.5406 249.799 73.4864 249.799 71.9063C249.799 46.3079 232.98 28.7682 208.5 28.7682C183.354 28.7682 165.868 46.4659 165.868 71.9063C165.868 97.8208 183.687 115.044 209.832 115.044C228.151 115.044 243.471 106.038 249.799 87.7078L229.15 80.7551C224.986 91.1841 218.325 95.2925 208.666 95.2925ZM208.5 47.256C215.619 47.256 222.654 51.348 224.985 59.2213H191.513C193.678 51.506 200.382 47.256 208.5 47.256Z" fill="#101010"/>
<path d="M300.799 95.2925C290.973 95.2925 284.312 90.078 282.98 77.1208H341.765C341.932 75.5406 341.932 73.4864 341.932 71.9063C341.932 46.3079 325.112 28.7682 300.632 28.7682C275.486 28.7682 258 46.4659 258 71.9063C258 97.8208 275.819 115.044 301.964 115.044C320.283 115.044 335.604 106.038 341.932 87.7078L321.282 80.7551C317.119 91.1841 310.457 95.2925 300.799 95.2925ZM300.632 47.256C307.751 47.256 314.786 51.348 317.118 59.2213H283.645C285.81 51.506 292.514 47.256 300.632 47.256Z" fill="#101010"/>
<path d="M46.1649 140.544C78.1809 140.544 92.1153 130.161 92.1153 114.587C92.1153 99.7996 78.015 89.8888 51.1415 89.8888H46.1649C38.0365 89.8888 22.5605 90.1802 22.5605 85.4608C22.5605 80.112 35.2164 80.6072 44.1743 80.6072C68.0619 80.6072 84.4846 71.4829 84.4846 56.538C84.4846 50.0881 81.8304 45.6833 76.6879 42.2223C82.328 41.1211 87.8023 39.7053 92.4471 37.8175L85.655 21.4926C74.5407 26.9986 60.0734 28.6498 45.8072 28.6498C23.0808 28.6498 6.51811 36.4017 6.51811 53.8637C6.51811 62.3587 10.4994 67.8647 17.1348 72.1122C7.51343 74.7865 0 80.4267 0 88.9217C0 96.6301 6.51811 101.845 13.8171 104.991C5.02514 108.452 0.0485549 113.801 0.0485549 121.194C0.0485549 130.948 12.1582 140.544 46.1649 140.544ZM45.8331 63.3025C35.3823 63.3025 30.4057 59.527 30.4057 53.7063C30.4057 47.8857 35.3823 43.7955 45.8331 43.7955C56.1181 43.7955 60.7629 47.8857 60.7629 53.7063C60.7629 59.527 56.1181 63.3025 45.8331 63.3025ZM45.999 124.026C31.5669 124.026 26.2586 121.509 26.2586 116.947C26.2586 112.385 31.5669 109.868 45.999 109.868C60.4311 109.868 65.5736 112.385 65.5736 116.947C65.5736 121.509 60.4311 124.026 45.999 124.026Z" fill="#101010"/>
<path d="M125.175 49.435V72.2415V115.197H100.695V28.6187H104.358C115.855 28.6187 125.175 37.9385 125.175 49.435Z" fill="#101010"/>
<path d="M139.652 60.0748C145.74 59.3922 161.285 55.68 169.088 35.7335C160.947 28.0263 148.39 26.2106 138.172 32.0907C129.685 36.9743 125.166 45.8671 125.166 55.0245V60.2249L135.32 60.2265L135.322 60.2265C136.769 60.2314 138.212 60.2362 139.652 60.0748Z" fill="#2FCE65"/>
</svg>
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    <Link to="/" component={RouterLink} sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default Logo;
