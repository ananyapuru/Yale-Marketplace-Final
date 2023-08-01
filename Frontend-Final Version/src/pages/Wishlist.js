import React, { useEffect, useState }  from 'react'
import { Container, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import { BiSearch } from 'react-icons/bi';
import { getObjects } from "../services/object.service";
import SearchFilter from 'react-filter-search';
import ObjectCard from '../components/ObjectCard';
import NavbarComponent from "../components/navbar/NavbarComponent";
import { getUserId } from '../services/auth.service';
import { getWishlistObjects } from '../services/object.service';
import { Flex } from '@chakra-ui/react';
import Footer from "../components/footer/Footer";

export default function Wishlist() {
    const [objects, setObjects] = useState([]);
    useEffect(()=>{
        getWishlistObjects(getUserId()).then(function(data){setObjects(data)})
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
        My WishList
      </h1>
      <Flex
        direction="row"
        gap={50}
        maxW={"80vw"}
        width={"fit-content"}
        minHeight='100vh'
        height="max-content"
        flexWrap={"wrap"}
        justify={"center"}
        margin="20px auto"
      >
        {objects ? (
          <>
            {objects.map((item, i) => (
              <ObjectCard data={item} key={i} isFavouritePage={true} />
            ))}
          </>
        ) : null}
      </Flex>
<Footer />
    </>
  );
}
