import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Box, Button, Paper } from '@mui/material';
import styled from 'styled-components';
import Students from "../assets/students.svg";
import { LightPurpleButton } from '../components/buttonStyles';

const Homepage = () => {
    return (
        <StyledContainer>
            <Grid container spacing={0}>
                <Grid item xs={12} md={6}>
                    <StyledImage src={Students} alt="students" />
                </Grid>
                <Grid item xs={12} md={6}>
                    <StyledContentWrapper elevation={3}>
                        <StyledTitle>
                            Welcome to<br />
                            School Management<br />
                            System
                        </StyledTitle>
                        <StyledText>
                            Streamline school management, class organization, and add students and faculty.
                            Seamlessly track attendance, assess performance, and provide feedback.
                            Access records, view marks, and communicate effortlessly.
                        </StyledText>
                        <StyledBox>
                            <StyledLink to="/choose">
                                <LightPurpleButton variant="contained" fullWidth>
                                    Login
                                </LightPurpleButton>
                            </StyledLink>
                            <StyledLink to="/chooseasguest">
                                <Button variant="outlined" fullWidth>
                                    Login as Guest
                                </Button>
                            </StyledLink>
                            <StyledText>
                                Don't have an account?{' '}
                                <StyledLink to="/Adminregister">
                                    Sign up
                                </StyledLink>
                            </StyledText>
                        </StyledBox>
                    </StyledContentWrapper>
                </Grid>
            </Grid>
        </StyledContainer>
    );
};

export default Homepage;

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledContentWrapper = styled(Paper)`
  padding: 24px;
  height: 100vh;
`;

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content:center;
  gap: 16px;
  padding: 24px;
`;

const StyledTitle = styled.h1`
  font-size: 3rem;
  color: #252525;
  font-weight: bold;
  padding-top: 0;
`;

const StyledText = styled.p`
  margin-top: 30px;
  margin-bottom: 30px; 
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const StyledImage = styled.img`
  width: 100%;
`;
