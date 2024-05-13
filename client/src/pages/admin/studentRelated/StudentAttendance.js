import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Box, InputLabel, MenuItem, Select, Typography, Stack, TextField, CircularProgress, FormControl
} from '@mui/material';
import { PurpleButton } from '../../../components/buttonStyles';
import Popup from '../../../components/Popup';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';

const StudentAttendance = ({ situation }) => {
  const dispatch = useDispatch();
  const { currentUser, userDetails, loading } = useSelector((state) => state.user);
  const { subjectsList } = useSelector((state) => state.sclass);
  const { response, error, statestatus } = useSelector((state) => state.student);
  const params = useParams();

  const [studentID, setStudentID] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [chosenSubName, setChosenSubName] = useState("");
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (situation === "Student" || situation === "Subject") {
      const stdID = situation === "Student" ? params.id : params.studentID;
      setStudentID(stdID);
      dispatch(getUserDetails(stdID, "Student"));
      if (situation === "Student" && userDetails && userDetails.sclassName) {
        dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
      } else if (situation === "Subject") {
        setChosenSubName(params.subjectID);
      }
    }
  }, [situation, params, dispatch, userDetails]);

  useEffect(() => {
    if (response || error || statestatus === "added") {
      setLoader(false);
      setShowPopup(true);
      setMessage(response || error || "Done Successfully");
    }
  }, [response, error, statestatus]);

  const changeHandler = (event) => {
    const selectedSubject = subjectsList.find((subject) => subject.subName === event.target.value);
    setSubjectName(selectedSubject.subName);
    setChosenSubName(selectedSubject._id);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(updateStudentFields(studentID, { subName: chosenSubName, status, date }, "StudentAttendance"));
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Box
          sx={{
            flex: '1 1 auto',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Box
            sx={{
              maxWidth: 550,
              px: 3,
              py: '100px',
              width: '100%'
            }}
          >
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">
                Student Name: {userDetails.name}
              </Typography>
              {currentUser.teachSubject && (
                <Typography variant="h4">
                  Subject Name: {currentUser.teachSubject?.subName}
                </Typography>
              )}
            </Stack>
            <form onSubmit={submitHandler}>
              <Stack spacing={3}>
                {situation === "Student" && (
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Select Subject</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={subjectName}
                      label="Choose an option"
                      onChange={changeHandler}
                      required
                    >
                      {subjectsList ? (
                        subjectsList.map((subject, index) => (
                          <MenuItem key={index} value={subject.subName}>
                            {subject.subName}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="Select Subject">
                          Add Subjects For Attendance
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                )}
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Attendance Status</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={status}
                    label="Choose an option"
                    onChange={(event) => setStatus(event.target.value)}
                    required
                  >
                    <MenuItem value="Present">Present</MenuItem>
                    <MenuItem value="Absent">Absent</MenuItem>
                  </Select>
                </FormControl>
                <FormControl>
                  <TextField
                    label="Select Date"
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
              </Stack>
              <PurpleButton
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                variant="contained"
                type="submit"
                disabled={loader}
              >
                {loader ? <CircularProgress size={24} color="inherit" /> : "Submit"}
              </PurpleButton>
            </form>
          </Box>
        </Box>
      )}
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};

export default StudentAttendance;
