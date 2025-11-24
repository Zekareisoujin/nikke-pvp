import { Box, Table, Thead, Tbody, Tr, Th, Td, Text, useColorModeValue, Select, Collapse, Button, HStack } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import type { Nikke, CubeLevel } from '../types';
// import { burstGenData, cubeBurstGenData, feedChart1Data, feedChart2Data } from '../burstGenData';

interface BurstStatsProps {
  selectedTeam: Nikke[];
}

// const CUBE_VALUES: Record<CubeLevel, number> = {
//   'No': 0,
//   'level 1': 0.0233,
//   'level 3': 0.035,
//   'level 7': 0.0466,
// };

export const BurstStats = ({ selectedTeam }: BurstStatsProps) => {
  const bg = useColorModeValue('white', 'gray.800');
  const [cubeLevels, setCubeLevels] = useState<CubeLevel[]>(Array(5).fill('No'));
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCubeChange = (index: number, value: CubeLevel) => {
    const newLevels = [...cubeLevels];
    newLevels[index] = value;
    setCubeLevels(newLevels);
  };

  // const calculateGen = (tierKey: string) => {
  //   let total = 0;
  //   selectedTeam.forEach((nikke, index) => {
  //     const charData = burstGenData[nikke.name];
  //     const cubeData = cubeBurstGenData[nikke.name];
  //     const cubeValue = CUBE_VALUES[cubeLevels[index]];

  //     if (charData) {
  //       let val = charData[tierKey] || 0;
  //       if (cubeData && cubeValue > 0) {
  //         val += (cubeData[tierKey] || 0) * cubeValue;
  //       }
  //       total += val;
  //     }
  //   });
  //   return parseFloat(total.toFixed(5)); // Match precision from screenshot
  // };

  // const calculateBullets = (tierKey: string) => {
  //   let min = 0;
  //   let max = 0;
  //   selectedTeam.forEach((nikke) => {
  //     const minData = feedChart1Data[nikke.name];
  //     const maxData = feedChart2Data[nikke.name];
      
  //     if (minData) min += minData[tierKey] || 0;
  //     if (maxData) max += maxData[tierKey] || 0;
  //   });
  //   return `${min} to ${max}`;
  // };

  return (
    <Box w="100%" borderRadius="lg" overflow="hidden" mb={4} boxShadow="lg">
      <Box p={4} bg={bg}>
        <HStack justify="space-between" mb={isExpanded ? 4 : 0}>
          <Text fontSize="lg" fontWeight="bold">Burst Generation Stats</Text>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            rightIcon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </HStack>
        
        <Collapse in={isExpanded} animateOpacity>
        
        {/* Cube Selection Table */}
        <Table variant="simple" size="sm" mb={6}>
          <Thead>
            <Tr>
              <Th>Position</Th>
              <Th>Nikke</Th>
              <Th>Quantum Cube</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array(5).fill(null).map((_, index) => (
              <Tr key={index}>
                <Td>Position {index + 1}</Td>
                <Td>{selectedTeam[index]?.name || '-'}</Td>
                <Td>
                  <Select 
                    size="xs" 
                    value={cubeLevels[index]} 
                    onChange={(e) => handleCubeChange(index, e.target.value as CubeLevel)}
                    isDisabled={!selectedTeam[index]}
                  >
                    <option value="No">No</option>
                    <option value="level 1">level 1</option>
                    <option value="level 3">level 3</option>
                    <option value="level 7">level 7</option>
                  </Select>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        </Collapse>
      </Box>
    </Box>
  );
};
