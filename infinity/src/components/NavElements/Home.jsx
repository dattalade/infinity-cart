import React from 'react'
import NavigationBar from '../NavBars/NavigationBar';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import Men from '../../images/homeimages/men.png'
import Footwear from '../../images/homeimages/footwear.png'
import Kid from '../../images/homeimages/kid.png'
import Accessories from '../../images/homeimages/accessories.png'
import { Link } from 'react-router-dom';
import styles from '../../css/Home.module.css'

const images = [
  {
    url: Men,
    title: `Explore Men's section`,
    width: '50%',
    link: '/men'
  },
  {
    url: Kid,
    title: `Explore Kid's section`,
    width: '50%',
    link: '/kids'
  },
  {
    url: Accessories,
    title: 'Explore Accessories section',
    width: '50%',
    link: '/accessories'
  },
  {
    url: Footwear,
    title: `Explore Footwear section`,
    width: '50%',
    link: '/footwear'
  },
];

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  height: 600,
  margin: "5%",
  [theme.breakpoints.down('sm')]: {
    width: '100% !important', // Overrides inline-style
    height: 100,
  },
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-root': {
      opacity: 0.3,
    },
    '& .MuiImageMarked-root': {
      opacity: 0,
    },
    '& .MuiTypography-root': {
      border: '4px solid currentColor',
    },
  },
}));

const ImageSrc = styled('span')({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center 40%',
});

const Image = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create('opacity'),
}));

const ImageMarked = styled('span')(({ theme }) => ({
  height: 1.8,
  width: 18,
  backgroundColor: "red",
  position: 'absolute',
  bottom: -2,
  left: 'calc(50% - 9px)',
  transition: theme.transitions.create('opacity'),
}));

const Home = () => {
  return (
    <>
      <NavigationBar link="home" />
      <Box className={styles['gridBox']} sx={{ width: '100%', padding: "0", paddingTop: '120px', justifyContent: 'center' }}>
        {images.map((image) => (
          <ImageButton
            focusRipple
            key={image.title}
            style={{
              width: "325px",
              height: "325px",
              padding: "0",
            }}
          >
            <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
            <ImageBackdrop className="MuiImageBackdrop-root" />
            <Link to={image.link}>
              <Image>
                <Typography
                  component="span"
                  variant="subtitle1"
                  color="inherit"
                  sx={{
                    position: 'relative',
                    p: 4,
                    pt: 2,
                    pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                  }}
                >
                  <h3 className={styles['fonts']}>{image.title}</h3>
                  <ImageMarked className="MuiImageMarked-root" />
                </Typography>
              </Image>
            </Link>
          </ImageButton>
        ))}
      </Box>

    </>
  )
}

export default Home;