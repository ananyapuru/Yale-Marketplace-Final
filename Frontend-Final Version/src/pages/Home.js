import React, { useEffect, useState }  from 'react'
import { Container, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import { BiSearch } from 'react-icons/bi';
import { getObjects } from "../services/object.service";
import SearchFilter from 'react-filter-search';
import ObjectCard from '../components/ObjectCard';
import NavbarComponent from "../components/navbar/NavbarComponent";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    FormGroup,
    Checkbox,
    Typography
  } from '@mui/material';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import dayjs from "dayjs";
import { Center, Flex } from '@chakra-ui/react';
import Footer from "../components/footer/Footer";

function valuetext(value) {
    return `${value}$`;
  }


export default function HomePage() {
    const [searchInput, setSearchInput] = useState('');
    const [objects, setObjects] = useState([]);
    const [defaultObjects, setDefaultObjects] = useState([]);
    const [open, setOpen] = useState(false);
    const [filters, setFilters] = useState({ option1: false, option2: false, option3: false });
    const [priceRange, setPriceRange] = React.useState([20, 37]);
    const [objectCategory, setObjectCategory] = useState([false, false, false])
    const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
    const handleClick = (event) => {
        setOpen(event.currentTarget);
    };
    
    const handleClose = () => {
        setOpen(false);
    };
    
    const handleApply = () => {
        console.log(selectedDateRange)
        const filteredObjects = defaultObjects.filter((object) => {
            return object.object_price <= priceRange[1] && object.object_price >= priceRange[0] &&
              (objectCategory[0] || object.object_category !== 'Item') &&
              (objectCategory[1] || object.object_category !== 'Renting') &&
              (objectCategory[2] || object.object_category !== 'Service') &&
              object.object_date.split(" ")[0] <= selectedDateRange[1] && object.object_date.split(" ")[0] >= selectedDateRange[0];
        });
        setObjects(filteredObjects);
        setOpen(false);
        
    };

    useEffect(()=>{
        getObjects().then(function(data){setObjects(data)})
        getObjects().then(function(data){setDefaultObjects(data)})
    },[])

    useEffect(()=>{
        console.log(objects)
    }, [objects])

    useEffect(()=>{
        console.log(defaultObjects)
    }, [defaultObjects])
    
    
    const handleChange = (event, newValue) => {
        setPriceRange(newValue);
    };
    

    const handleDateChange = (dateRange) => {
        const startDate = dateRange[0] ? dayjs(dateRange[0]).format("YYYY-MM-DD") : null;
        const endDate = dateRange[1] ? dayjs(dateRange[1]).format("YYYY-MM-DD") : null;
        setSelectedDateRange([startDate, endDate])
    };

    const handleChange1 = (event) => {
        setObjectCategory([!objectCategory[0], objectCategory[1], objectCategory[2]]);
    };
    const handleChange2 = (event) => {
        setObjectCategory([objectCategory[0], !objectCategory[1], objectCategory[2]]);
    };
    const handleChange3 = (event) => {
        setObjectCategory([objectCategory[0], objectCategory[1], !objectCategory[2]]);
    };
  return (
    <>
      <NavbarComponent />
      <Container
        className="py-4"
        style={{
          width: "100vw",
          minHeight: "100vh",
        }}
      >
        <Row className="justify-content-center">
          <Center width={'100vw'}>
            <Col
              xs={10}
              md={7}
              lg={6}
              xl={4}
              className="mb-3 mx-auto text-center"
            >
              <h1 className="my-5" style={{
  background: "-webkit-linear-gradient(to right, #F12711, #F5AF19)",
  "-webkit-background-clip": "text",
  "-webkit-text-fill-color": "black",
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 400,
  fontSize: "2.5rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#000",
  whiteSpace: "nowrap"
}}>
  Search objects
</h1>
              <InputGroup className="mb-3">
                <InputGroup.Text className={"bg-light text-light-primary"} style={{height:'100%'}}>
                  <BiSearch size="2rem" />
                </InputGroup.Text>
                <FormControl
                  placeholder="Search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="bg-light text-black"
                />
              </InputGroup>

              <Button variant="contained" color="primary" onClick={handleClick}>
                Filter
              </Button>
              <Dialog
                open={open}
                onClose={handleClose}
                style={{ marginTop: "-100px" }}
              >
                <div>
                  <DialogTitle
                    style={{ display: "inline-block", height: "20px" }}
                  >
                    Filter Options
                  </DialogTitle>
                  <DialogContent>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "30px",
                        }}
                      >
                        <Typography>Price:</Typography>
                        <Box sx={{ width: 300 }}>
                          <Slider
                            getAriaLabel={() => "Temperature range"}
                            value={priceRange}
                            onChange={handleChange}
                            valueLabelDisplay="auto"
                            size="small"
                            getAriaValueText={valuetext}
                            min={0}
                            max={5000}
                          />
                        </Box>
                      </div>
                      <div style={{ marginTop: "10px" }}>
                        <Typography>Date Posted:</Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DateRangePicker"]}>
                            <DateRangePicker
                              onChange={handleDateChange}
                              localeText={{
                                start: "Check-in",
                                end: "Check-out",
                              }}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </div>
                      <div style={{ marginTop: "10px" }}>
                        <Typography>Category:</Typography>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={objectCategory[0]}
                              onChange={handleChange1}
                              name="jason"
                            />
                          }
                          label="Item"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={objectCategory[1]}
                              onChange={handleChange2}
                              name="jason"
                            />
                          }
                          label="Renting"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={objectCategory[2]}
                              onChange={handleChange3}
                              name="jason"
                            />
                          }
                          label="Service"
                        />
                      </div>
                    </div>
                  </DialogContent>
                </div>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={handleApply}>Apply</Button>
                </DialogActions>
              </Dialog>
            </Col>
          </Center>
          <SearchFilter
            value={searchInput}
            data={objects}
            renderResults={(results) => (
              <Flex
                direction="row"
                gap={50}
                maxW={"80vw"}
                width={"fit-content"}
                height="max-content"
                flexWrap={"wrap"}
                justify={"center"}
                margin="20px auto"
              >
                {results.map((item, i) => (
                  <ObjectCard data={item} key={i} isFavouritePage={false} />
                ))}
              </Flex>
            )}
          />
        </Row>
      </Container>
      <Footer />
    </>
  );
}
