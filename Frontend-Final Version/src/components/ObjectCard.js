import React from 'react';

import Button from "@mui/material/Button";
import { BsFillHeartFill, BsFillTrashFill } from 'react-icons/bs';
import { Col, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { getUserId } from '../services/auth.service';
import { addToWishlist, deleteFromWishlist } from '../services/object.service';
import { Flex,HStack, background } from '@chakra-ui/react';

import './card.css'
import { ButtonGroup } from '@mui/material';


const ObjectCard = (props) => {
    const data = props.data;
    
    const id = data['object_id']
    const image = data['object_image']
    const price = data['object_price']
    const description = data["object_description"];

    const category = data["object_category"];
    const filterCategory = (category)=>{
        if (category === 'Renting,'){
            return 'rent'
        }
        else if(category === 'Item,')
        {
            return 'sell'
        }
        else if(category === 'Service')
        {
            return 'service'
        }
        else if (category.trim() === '')
        {
            return 'sell'
        }
        
    } 

    const filteredCategory= filterCategory(category)
    

    const tags = data['object_tags']
    const title = data['object_title']
    const owner = data['user_id'] 
    const user_id = getUserId()
    const handleDelete = () => {
        deleteFromWishlist(id, user_id) 
        alert('Object deleted from your Wishlist')
    }
    const handleSubmit = () => {
      addToWishlist(id, user_id)
      alert('Object added to your Wishlist')

    }
    return (
      <>
        <div className="card">
          <Flex
            direction={"column"}
            justifyContent={"space-between"}
            height={"100%"}
            w={"100%"}
            padding={"20px"}
          >
            <Flex direction={"column"} rowGap={"5px"} w={"100%"}>
              <img className="image-div" src={image[0]} />
              <Flex
                direction={"column"}
                rowGap={"5px"}
                w={"100%"}
                margin={"20px 0 0 0  "}
              >
                <Flex className="card-header flex">
                  <h1>{title}</h1>
                  <span
                    className={`tag ${
                      filteredCategory === "rent" ? "blue" : "orange"
                    } `}
                  >
                    #{filteredCategory}
                  </span>
                </Flex>
                <p className="details">
                  <b>Details: </b>
                  {description}
                </p>
                <p className="price">
                  ${price}
                  {filteredCategory === "rent" ? "/day" : ""}{" "}
                </p>
              </Flex>
            </Flex>
            <hr></hr>
            <ButtonGroup className="mycard-footer flex">
              <NavLink
                style={{
                  textDecoration: "none",
                }}
                to={`/objects/${id}`}
              >
                {" "}
                <Button variant="contained">More Info</Button>
              </NavLink>
              {props.isFavouritePage ? (
                <Button
                  variant="text"
                  onClick={() => handleDelete()}
                  className="red_effect"
                >
                  Delete
                </Button>
              ) : (
                <Button onClick={() => handleSubmit()} variant="text">
                  Save
                </Button>
              )}
            </ButtonGroup>
          </Flex>
        </div>
      </>
    );
  };
  
  export default ObjectCard;