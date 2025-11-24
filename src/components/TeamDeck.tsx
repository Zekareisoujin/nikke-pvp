import { Box, HStack, VStack, Text } from '@chakra-ui/react';
import type { Nikke } from '../types';
import { CharacterCard } from './CharacterCard';
import { burstGenData } from '../burstGenData';

interface TeamDeckProps {
  selectedTeam: Nikke[];
  onRemove: (nikke: Nikke) => void;
}

const TIERS = [
  { key: '2RL', label: '2RL' },
  { key: '5SG(2.5RL)', label: '2.5RL' },
  { key: '3RL', label: '3RL' },
  { key: '7SG(3.5RL)', label: '3.5RL' },
  { key: '4RL', label: '4RL' },
];

export const TeamDeck = ({ selectedTeam, onRemove }: TeamDeckProps) => {
  const slots = Array(5).fill(null);

  // Calculate generation for a tier
  const calculateGen = (tierKey: string) => {
    let total = 0;
    selectedTeam.forEach((nikke) => {
      const charData = burstGenData[nikke.name];
      if (charData) {
        total += charData[tierKey] || 0;
      }
    });
    return total;
  };

  // Check if team can burst (has at least one of each burst type)
  const canBurst = () => {
    const hasBurst1 = selectedTeam.some(n => n.burstType === '1');
    const hasBurst2 = selectedTeam.some(n => n.burstType === '2');
    const hasBurst3 = selectedTeam.some(n => n.burstType === '3');
    return hasBurst1 && hasBurst2 && hasBurst3;
  };

  // Find the final burst tier (first tier >= 100%)
  const getFinalTier = () => {
    for (const tier of TIERS) {
      if (calculateGen(tier.key) >= 100) {
        return tier.key;
      }
    }
    return null;
  };

  const teamCanBurst = canBurst();
  const finalTier = getFinalTier();

  return (
    <Box w="100%" p={4} bg="gray.900" borderRadius="lg" mb={4}>
      <Text color="white" mb={4} fontWeight="bold">Current Team</Text>
      
      {/* Burst Generation Display */}
      <HStack spacing={3} justify="center" mb={4}>
        {TIERS.map((tier) => {
          const gen = calculateGen(tier.key);
          const isFinalTier = tier.key === finalTier;
          const percentage = `${gen.toFixed(2)}%`;
          
          return (
            <VStack
              key={tier.key}
              spacing={0}
              p={2}
              minW="80px"
              border="2px solid"
              borderColor={isFinalTier ? (teamCanBurst ? 'green.400' : 'red.500') : 'transparent'}
              borderRadius="md"
              bg="gray.800"
            >
              <Text
                fontSize="md"
                fontWeight="bold"
                color={
                  !teamCanBurst 
                    ? 'red.500' 
                    : gen >= 100 
                      ? 'green.400' 
                      : 'white'
                }
              >
                {tier.label}
              </Text>
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color={
                  !teamCanBurst 
                    ? 'red.500' 
                    : gen >= 100 
                      ? 'green.400' 
                      : 'gray.400'
                }
              >
                {percentage}
              </Text>
            </VStack>
          );
        })}
      </HStack>

      {/* Team Slots */}
      <HStack spacing={4} justify="center" h="120px">
        {slots.map((_, index) => {
          const nikke = selectedTeam[index];
          return (
            <Box
              key={index}
              w="100px"
              h="100px"
              border="2px dashed"
              borderColor="gray.600"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="relative"
            >
              {nikke ? (
                <Box 
                  w="100px" 
                  h="100px" 
                  overflow="hidden" 
                  borderRadius="md"
                  cursor="pointer"
                  onClick={() => onRemove(nikke)}
                  transition="all 0.2s"
                  _hover={{ opacity: 0.8 }}
                  position="relative"
                >
                  <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -35%) scale(0.833)"
                    transformOrigin="center"
                  >
                    <CharacterCard nikke={nikke} onClick={() => {}} hideIcons />
                  </Box>
                </Box>
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
