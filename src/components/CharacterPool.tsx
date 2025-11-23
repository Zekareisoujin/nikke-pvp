import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import type { Nikke } from '../types';
import { CharacterCard } from './CharacterCard';

interface CharacterPoolProps {
  nikkes: Nikke[];
  onSelect: (nikke: Nikke) => void;
  selectedIds: string[];
}

export const CharacterPool = ({ nikkes, onSelect, selectedIds }: CharacterPoolProps) => {
  return (
    <Box w="100%" p={4} bg="gray.800" borderRadius="lg">
      <Text color="white" mb={4} fontWeight="bold">Character Pool</Text>
      <SimpleGrid columns={[3, 4, 6, 8]} spacing={4}>
        {nikkes.map((nikke) => (
          <CharacterCard
            key={nikke.id}
            nikke={nikke}
            onClick={onSelect}
            isSelected={selectedIds.includes(nikke.id)}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};
