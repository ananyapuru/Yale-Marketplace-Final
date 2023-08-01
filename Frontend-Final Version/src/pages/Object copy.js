import React, { useState, useEffect } from 'react';
import { getUser } from "../services/user.service";
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { useCart } from 'react-use-cart';
import { getObject } from '../services/object.service';
import NavbarComponent from "../components/navbar/NavbarComponent";
import Carousel from 'react-bootstrap/Carousel';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { Flex, Table, Tbody, Tr, Td, TableContainer,Text, HStack,Tag, VStack, Box } from "@chakra-ui/react";
import Footer from "../components/footer/Footer";
import '../components/card.css'

function ControlledCarousel({images}) {
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
          }}
        />
      </Carousel.Item>
    ));
    
    return (
      <Flex placeItems={'center'} width={'400px'}> 
        <Carousel
          style={{ width: "350px" }}
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
    useEffect(()=>{
        getObject(object_id).then(function(data){setObjectData(data)})
    },[])

    useEffect(()=>{
        console.log(objectData)
        getUser(objectData.user_id).then(function(data){setOwnerData(data)})
    }, [objectData])

    /* useEffect(()=>{
       // console.log(ownerData)
    }, [ownerData]) 
    */
  return (
    <div>
      <NavbarComponent />
      <div className="container" style={{ minHeight: "100vh" }}>
        <Flex align={"center"} margin={"50px auto"}>
          {/* <div className="col-md-6">
                    <div className='mx-auto'>
                        <img src={objectData.object_image[0]}  alt={objectData.object_title} height="400px" width="400px"/>
                    </div>
                </div> */}
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
                      >
                        #{filteredCategory}
                      </span>
                      {/*  <Tag
                          variant={"subtle"}
                          colorScheme="orange"
                          fontWeight="300"
                        >
                          #{objectData.object_tags}
                        </Tag> */}
                    </HStack>
                  </Td>
                </Tr>
                {/* <Tr>
                  <Td>
                    <Text color="black" fontWeight={"bold"}>
                      Seller Name
                    </Text>
                  </Td>
                  <Td>
                    <Text> {owner}</Text>
                  </Td>
                </Tr> */}
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
                    <Text>  
                    <a href={`mailto:${contact}`} style={{ marginLeft: '10px' }}>
      {contact}
    </a>
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
