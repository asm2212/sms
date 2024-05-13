import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getAllStudents } from '../../../redux/studentRelated/studentHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import {
  Paper, Box, IconButton, Button, ButtonGroup, MenuItem, MenuList, Popper,
  Grow, ClickAwayListener
} from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { BlackButton, BlueButton, GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';


const ShowStudents = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { studentsList, loading, error, response } = useSelector((state) => state.student);
  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(getAllStudents(currentUser._id));
  }, [currentUser._id, dispatch]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    setMessage("Sorry, the delete function has been disabled for now.");
    setShowPopup(true);
    // dispatch(deleteUser(deleteID, address))
    //   .then(() => {
    //     dispatch(getAllStudents(currentUser._id));
    //   });
  };

  const studentColumns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
    { id: 'sclassName', label: 'Class', minWidth: 170 },
  ];

  const studentRows = studentsList && studentsList.length > 0 && studentsList.map((student) => {
    return {
      name: student.name,
      rollNum: student.rollNum,
      sclassName: student.sclassName.sclassName,
      id: student._id,
    };
  });

  const StudentButtonHaver = ({ row }) => {
    const options = ['Take Attendance', 'Provide Marks'];

    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleMenuItemClick = (event, index) => {
      setSelectedIndex(index);
      setOpen(false);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
      setOpen(false);
    };

    const handleButtonClick = (index) => {
      setSelectedIndex(index);
      if (index === 0) {
        navigate(`/Admin/students/student/attendance/${row.id}`);
      } else if (index === 1) {
        navigate(`/Admin/students/student/marks/${row.id}`);
      }
    };

    return (
      <>
        <IconButton onClick={() => deleteHandler(row.id, "Student")}>
          <PersonRemoveIcon color="error" />
        </IconButton>
        <BlueButton variant="contained" onClick={() => navigate(`/Admin/students/student/${row.id}`)}>
          View
        </BlueButton>
        <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
          <Button onClick={() => handleButtonClick(selectedIndex)}>{options[selectedIndex]}</Button>
          <BlackButton
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={() => setOpen((prevOpen) => !prevOpen)}
          >
            
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </BlackButton>
        </ButtonGroup>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu" autoFocusItem={open}>
                    {options.map((option, index) => (
                      <MenuItem
                        key={option}
                        disabled={index === 2}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </>
    );
  };

  const actions = [
    {
      icon: <PersonAddAlt1Icon color="primary" />,
      name: 'Add New Student',
      action: () => navigate("/Admin/addstudents")
    },
    {
      icon: <PersonRemoveIcon color="error" />,
      name: 'Delete All Students',
      action: () => deleteHandler(currentUser._id, "Students")
    },
  ];

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {response ? (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <GreenButton variant="contained" onClick={() => navigate("/Admin/addstudents")}>
                Add Students
              </GreenButton>
            </Box>
          ) : (
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              {Array.isArray(studentsList) && studentsList.length > 0 && (
                <TableTemplate buttonHaver={StudentButtonHaver} columns={studentColumns} rows={studentRows} />
              )}
              <SpeedDialTemplate actions={actions} />
            </Paper>
          )}
        </>
      )}
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};

export default ShowStudents;
