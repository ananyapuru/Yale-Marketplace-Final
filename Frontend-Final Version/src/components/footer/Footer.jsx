import Yale from '../../assets/images/Yalefooter.png'
import { Center, HStack, Text } from '@chakra-ui/react'

function Footer() {
  return (
    <Center className="page-footer" style={{ 
      backgroundColor: '#00356B',
      padding: '30px',
      background: 'linear-gradient(to bottom, #000000, #00356B)'
    }}>
      <HStack direction="column" gap={"10px"}>
        <img src={Yale} alt="Yale Logo" />
        <Text size="sm" color="white" fontWeight={"400"} style={{ color: 'white' }}>
          &copy; 2023 All Rights Reserved | Yale University
        </Text>
      </HStack>
    </Center>
  );
}

export default Footer;
