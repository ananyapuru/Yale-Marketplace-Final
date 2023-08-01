import React, { useState, useEffect } from "react";
import { Flex, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import "./navbar.css";
import Yalelogo from "../../assets/images/yalelogoheader2inv.png";
import { Cart3, PersonCircle } from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";

import { Container, Navbar, Nav } from "react-bootstrap";
import {
  BiMessageSquareAdd,
  BiLogOut,
  BiBookHeart,
  BiCabinet,
} from "react-icons/bi";
import { Link } from "@reach/router";
import { useNavigate } from "react-router-dom";
import { getUserId, logout } from "../../services/auth.service";
import { getUser } from "../../services/user.service";

const UserName = React.memo(
  ({ firstName, lastName }) => {
    return (
      <div>
        <NavLink className="navOption" to="/home">
          {firstName && lastName ? (
           <Text>
              {firstName} {lastName}
            </Text>
          ) : null}
        </NavLink>

      </div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if user_id changes
    return prevProps.user_id === nextProps.user_id;
  }
);

const NavbarComponent = () => {
  const user_id = getUserId();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true); // add a loading state

  useEffect(() => {
    getUser(user_id).then((user) => {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setLoading(false); // set loading to false once data is retrieved
    });
    /*  console.log("===============")
        console.log(firstName)
        console.log(lastName)
        console.log("===============") */
  }, [user_id, firstName, lastName]);

  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="cont">
      <Flex
        direction={"row"}
        justify={"space-between"}
        width={"90%"}
        height="100%"
        margin={" auto "}
      >
        <NavLink to="/home" style={{ textDecoration: "none" }}>
          <HStack className="leftBar">
            <img src={Yalelogo} height="50px" width="90px" alt="Yale Logo" />
            <Heading
              id="home"
              color={"#132a37"}
              margin={"auto auto 0 auto"}
              size="4xl"
              className="header"
              fontWeight={'700'}
              fontFamily="Poppins"
              fontSize="10xl" 
            >
              <h1 fontSize="4xl">MarketPlace</h1>
            </Heading>
          </HStack>
        </NavLink>

        <ul className="rightBar">
          <li>
            <NavLink className="navOption" to="/addObject">
              <HStack>
                <BiMessageSquareAdd size="2rem" />
                <Text fontFamily="Poppins">Add Item</Text>
              </HStack>
            </NavLink>
          </li>
          <li>
            <NavLink className="navOption" to="/listing">
              <HStack>
                <BiCabinet size="2rem" />
                <Text fontFamily="Poppins">Listing</Text>
              </HStack>
            </NavLink>
          </li>
          <li>
            <NavLink className="navOption " to="/wishlist">
              <HStack>
                <BiBookHeart size="2rem" />
                <Text fontFamily="Poppins">Wishlist</Text>
              </HStack>
            </NavLink>
          </li>
          <li>
            <NavLink className="navOption " to="/login" onClick={handleLogout}>
              <HStack>
                <BiLogOut size="2rem" />
                <Text fontFamily="Poppins">Logout</Text>
              </HStack>
            </NavLink>
          </li>
         {/*  <li>
            {" "}
            {loading ? (
              <Text>Loading...</Text>
            ) : (
              <UserName firstName={firstName} lastName={lastName} />
            )}
          </li> */}
        </ul>
      </Flex>
    </div>
  );
};

export default NavbarComponent;
