import React, { useState, useEffect } from 'react';
import { getUser } from "../services/user.service";
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { useCart } from 'react-use-cart';
import { getObject } from '../services/object.service';
import NavbarComponent from "../components/navbar/NavbarComponent";
import Carousel from 'react-bootstrap/Carousel';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { Flex, Table, Tbody, Tr, Td, TableContainer, Text, HStack, Tag, VStack, Box } from "@chakra-ui/react";
import Footer from "../components/footer/Footer";
import '../components/card.css';

function ControlledCarousel({ images }) {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const sliderItems = images.map((image, index) => (
    <Carousel.Item key={index}>
      <img
        className="d-block w-100"
        src={image}
        alt={`Slider Image ${index}`}
        style={{
          borderRadius: "10px",
          width: "100%",
          objectFit: "cover",
          height: "600px", // Increase the height of the image
        }}
      />
    </Carousel.Item>
  ));

  return (
    <Flex placeItems={'center'} width={'600px'}>
      <Carousel
        style={{ width: "550px" }}
        variant="dark"
        activeIndex={index}
        onSelect={handleSelect}
      >
        {sliderItems}
      </Carousel>
    </Flex>
  );
}

export default function Object() {
  const [objectData, setObjectData] = useState([]);
  const [ownerData, setOwnerData] = useState([]);

  const date = objectData.object_date;
  const title = objectData.object_title;
  const price = objectData.object_price;
  const image = objectData.object_image;
  const category = objectData.object_category;
  const contact = objectData.object_contact;
  const description = objectData.object_description;
  const owner = ownerData.firstname;
  const filterCategory = (category) => {
    if (category === "Renting,") {
      return "rent";
    } else if (category === "Item,") {
      return "sell";
    } else if (category === "Service") {
      return "service";
    } else if (category === "") {
      return "sell";
    }
  };

  const filteredCategory = filterCategory(category);

  const { object_id } = useParams();
  useEffect(() => {
    getObject(object_id).then(function (data) { setObjectData(data) })
  }, [])

  useEffect(() => {
    console.log(objectData)
    getUser(objectData.user_id).then(function (data) { setOwnerData(data) })
  }, [objectData])

  return (
    <div>
      <NavbarComponent />
      <div className="container" style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Flex align={"center"} margin={"50px auto"} style={{ flexDirection: "column", fontFamily: "serif", fontSize: "1.2rem" }}>
          {objectData.object_image ? (
            <ControlledCarousel images={image} />
          ) : null}

          <TableContainer>
          <Table size={"lg"} width={"80%"}>
              <Tbody>
                <Tr>
                  <Td>
                    <Text color="black" fontWeight={"bold"}>
                      Product
                    </Text>
                  </Td>
                  <Td>
                    <Text> {title} </Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text color="black" fontWeight={"bold"}>
                      Price
                    </Text>
                  </Td>
                  <Td>
                    <Text color="black.600"> ${price}</Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text color="black" fontWeight={"bold"}>
                      Category
                    </Text>
                  </Td>
                  <Td>
                    <HStack width={"100%"} align="start" justify={"start"}>
                      <span
                        className={`tag ${
                          filteredCategory === "rent" ? "blue" : "orange"
                        } `}
                        style={{
                          marginLeft: "10px",
                          marginRight: "0",
                          marginVertical: "0",
                          marginTop: "-15px",
                          textTransform: "uppercase",
                        }}
                      >
                        #{filteredCategory}
                      </span>
                    </HStack>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text color="black" fontWeight={"bold"}>
                      Date Listed
                    </Text>
                  </Td>
                  <Td>
                    <Text> {date}</Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text color="black" fontWeight={"bold"}>
                      Contact Info:   
                    </Text>
                  </Td>
                  <Td>
                  <Text style={{ marginLeft: '10px', marginVertical: '0' }}>
                    {contact}
                  </Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text color="black" fontWeight={"bold"}>
                      Description
                    </Text>
                  </Td>
                  <Td>
                    <Text>{description}</Text>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
      </div>
      <Footer />
    </div>
  );
}

