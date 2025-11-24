import { Box, Image, Text, VStack } from '@chakra-ui/react';
import type { Nikke } from '../types';

interface CharacterCardProps {
  nikke: Nikke;
  onClick: (nikke: Nikke) => void;
  isSelected?: boolean;
  hideIcons?: boolean;
}

export const CharacterCard = ({ nikke, onClick, isSelected, hideIcons = false }: CharacterCardProps) => {
  const borderColor = isSelected ? 'blue.500' : 'gray.300';

  return (
    <Box
      w="120px"
      h="180px"
      borderRadius="md"
      overflow="hidden"
      cursor="pointer"
      onClick={() => onClick(nikke)}
      borderWidth="2px"
      borderColor={borderColor}
      position="relative"
      transition="all 0.2s"
      _hover={{ transform: 'scale(1.05)', borderColor: 'blue.400' }}
      bg="white"
    >
      {/* Character Portrait */}
      <Image 
        src={nikke.imageUrl} 
        alt={nikke.name} 
        w="100%" 
        h="100%" 
        objectFit="cover"
        position="absolute"
        top={0}
        left={0}
      />


      {/* Left Icon Stack */}
      {!hideIcons && (
        <VStack 
          position="absolute" 
          top="8px" 
          left="8px" 
          spacing={1}
          align="flex-start"
        >
          {/* Element Icon */}
          {nikke.elementIcon && (
            <Box 
              bg="black" 
              borderRadius="md" 
              p="2px"
              w="24px"
              h="24px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image src={nikke.elementIcon} alt="element" boxSize="20px" />
            </Box>
          )}
          {/* Weapon Type Icon */}
          {nikke.weaponIcon && (
            <Box 
              bg="black" 
              borderRadius="md" 
              p="2px"
              w="24px"
              h="24px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image src={nikke.weaponIcon} alt="weapon" boxSize="20px" />
            </Box>
          )}
          {/* Class Icon */}
          {nikke.classIcon && (
            <Box 
              bg="black" 
              borderRadius="full" 
              p="2px"
              w="24px"
              h="24px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image src={nikke.classIcon} alt="class" boxSize="20px" />
            </Box>
          )}
          {/* Burst Type Icon */}
          {nikke.burstIcon && (
            <Box 
              bg="black" 
              borderRadius="md" 
              p="2px"
              w="24px"
              h="24px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image src={nikke.burstIcon} alt="burst" boxSize="20px" />
            </Box>
          )}
        </VStack>
      )}

      {/* Bottom Bar */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        bg="linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.7))"
        p={2}
      >
        {/* Character Name */}
        <Text 
          fontSize="12px" 
          color="white" 
          fontWeight="bold" 
          noOfLines={1}
          textAlign="center"
        >
          {nikke.name}
        </Text>
      </Box>
    </Box>
  );
};
