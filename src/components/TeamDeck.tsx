import { Box, HStack, Text, IconButton } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import type { Nikke } from '../types';
import { CharacterCard } from './CharacterCard';

interface TeamDeckProps {
  selectedTeam: Nikke[];
  onRemove: (nikke: Nikke) => void;
}

export const TeamDeck = ({ selectedTeam, onRemove }: TeamDeckProps) => {
  const slots = Array(5).fill(null);

  return (
    <Box w="100%" p={4} bg="gray.900" borderRadius="lg" mb={4}>
      <Text color="white" mb={2} fontWeight="bold">Current Team</Text>
      <HStack spacing={4} justify="center" h="160px">
        {slots.map((_, index) => {
          const nikke = selectedTeam[index];
          return (
            <Box
              key={index}
              w="100px"
              h="140px"
              border="2px dashed"
              borderColor="gray.600"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="relative"
            >
              {nikke ? (
                <>
                  <CharacterCard nikke={nikke} onClick={() => {}} />
                  <IconButton
                    aria-label="Remove character"
                    icon={<CloseIcon />}
                    size="xs"
                    colorScheme="red"
                    position="absolute"
                    top="-8px"
                    right="-8px"
                    onClick={() => onRemove(nikke)}
                    isRound
                  />
                </>
              ) : (
                <Text color="gray.500" fontSize="sm">Slot {index + 1}</Text>
              )}
            </Box>
          );
        })}
      </HStack>
    </Box>
  );
};
