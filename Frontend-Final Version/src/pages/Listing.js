import React, { useEffect, useState }  from 'react'
import { Container, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import { BiSearch } from 'react-icons/bi';
import { getListingObjects, getObjects } from "../services/object.service";
import SearchFilter from 'react-filter-search';
import ObjectCard from '../components/ObjectCard';
import NavbarComponent from "../components/navbar/NavbarComponent";
import { getUserId } from '../services/auth.service';
import { getWishlistObjects } from '../services/object.service';
import ObjectListing from '../components/ObjectListing';
import { Flex } from '@chakra-ui/react';
import Footer from "../components/footer/Footer";

export default function Listing() {
    const [objects, setObjects] = useState([]);
    useEffect(()=>{
        getListingObjects(getUserId()).then(function(data){setObjects(data)})
    },[])

    useEffect(()=>{
        console.log(objects)
    }, [objects])
  return (
    <>
      <NavbarComponent />
      <h1
        className={"text-black my-5"}
        style={{ margin: "auto", width: "fit-content" }}
      >
        My Listing
      </h1>
      <Flex
        direction="row"
        gap={50}
        maxW={"80vw"}
        width={"fit-content"}
        height="max-content"
        minHeight={'100vh'}
        flexWrap={"wrap"}
        justify={"center"}
        margin="20px auto"
      >
        {objects.map((item, i) => (
          <ObjectListing data={item} key={i} isFavouritePage={true} />
        ))}
      </Flex>
      <Footer />
    </>
  );
}
