import { Box, Image, Text, Badge, VStack, useColorModeValue } from '@chakra-ui/react';
import type { Nikke } from '../types';

interface CharacterCardProps {
  nikke: Nikke;
  onClick: (nikke: Nikke) => void;
  isSelected?: boolean;
}

export const CharacterCard = ({ nikke, onClick, isSelected }: CharacterCardProps) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = isSelected ? 'blue.500' : 'transparent';

  return (
    <Box
      w="100px"
      h="140px"
      bg={bg}
      borderRadius="md"
      overflow="hidden"
      cursor="pointer"
      onClick={() => onClick(nikke)}
      borderWidth="2px"
      borderColor={borderColor}
      position="relative"
      transition="all 0.2s"
      _hover={{ transform: 'scale(1.05)' }}
    >
      <Image src={nikke.imageUrl} alt={nikke.name} w="100%" h="100px" objectFit="cover" />
      <VStack spacing={0} p={1} align="center">
        <Text fontSize="xs" fontWeight="bold" noOfLines={1}>
          {nikke.name}
        </Text>
        <Badge colorScheme={nikke.burstType === 'I' ? 'green' : nikke.burstType === 'II' ? 'yellow' : 'red'} fontSize="xx-small">
          {nikke.burstType}
        </Badge>
        {/* Icon row */}
        <Box display="flex" justifyContent="center" mt={1}>
          {nikke.elementIcon && <Image src={nikke.elementIcon} alt="element" boxSize="12px" mr={1} />}
          {nikke.weaponIcon && <Image src={nikke.weaponIcon} alt="weapon" boxSize="12px" mr={1} />}
          {nikke.burstIcon && <Image src={nikke.burstIcon} alt="burst" boxSize="12px" mr={1} />}
          {nikke.classIcon && <Image src={nikke.classIcon} alt="class" boxSize="12px" />}
        </Box>
      </VStack>
    </Box>
  );
};
