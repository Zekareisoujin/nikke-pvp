import { Box, Image } from '@chakra-ui/react';
import type { Nikke } from '../types';

interface TeamDeckCardProps {
  nikke: Nikke;
  onClick: (nikke: Nikke) => void;
}

export const TeamDeckCard = ({ nikke, onClick }: TeamDeckCardProps) => {
  return (
    <Box
      w="100px"
      h="100px"
      cursor="pointer"
      onClick={() => onClick(nikke)}
      position="relative"
      transition="all 0.2s"
      _hover={{ opacity: 0.8 }}
      borderRadius="md"
      overflow="hidden"
      bg="white"
    >
      {/* Character Portrait */}
      <Image
        src={nikke.imageUrl}
        alt={nikke.name}
        w="100%"
        h="100%"
        objectFit="cover"
        objectPosition="center -20px"
      />
    </Box>
  );
};
