import { Box, SimpleGrid, Text, Input, HStack, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import type { Nikke } from '../types';
import { CharacterCard } from './CharacterCard';
import { FilterPopover, type FilterState } from './FilterPopover';

interface CharacterPoolProps {
  nikkes: Nikke[];
  onSelect: (nikke: Nikke) => void;
  selectedIds: string[];
}

export const CharacterPool = ({ nikkes, onSelect, selectedIds }: CharacterPoolProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    elements: [],
    weapons: [],
    classes: [],
    burstTypes: [],
    rarities: [],
  });

  // Optimize filtering by using CSS display instead of removing from DOM
  const getIsVisible = (nikke: Nikke) => {
    // Search filter
    if (searchQuery && !nikke.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filters
    if (filters.elements.length > 0 && !filters.elements.includes(nikke.element)) return false;
    if (filters.weapons.length > 0 && !filters.weapons.includes(nikke.weaponType)) return false;
    if (filters.classes.length > 0 && !filters.classes.includes(nikke.classType)) return false;
    if (filters.burstTypes.length > 0 && !filters.burstTypes.includes(nikke.burstType)) return false;
    if (filters.rarities.length > 0 && !filters.rarities.includes(nikke.rarity)) return false;

    return true;
  };

  // Count visible items for the "No characters found" message
  const visibleCount = nikkes.filter(getIsVisible).length;

  return (
    <Box w="100%" p={4} bg="gray.800" borderRadius="lg">
      <HStack mb={4} justify="space-between">
        <Text color="white" fontWeight="bold" fontSize="xl">Character Pool</Text>
        <HStack>
          <InputGroup w="300px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search characters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg="gray.700"
              border="none"
              color="white"
              _focus={{ bg: 'gray.600', boxShadow: 'none' }}
            />
          </InputGroup>
          <FilterPopover filters={filters} onFilterChange={setFilters} />
        </HStack>
      </HStack>

      <SimpleGrid columns={[3, 4, 6, 8]} spacing={4}>
        {nikkes.map((nikke) => {
          const isVisible = getIsVisible(nikke);
          return (
            <Box key={nikke.id} display={isVisible ? 'block' : 'none'}>
              <CharacterCard
                nikke={nikke}
                onClick={onSelect}
                isSelected={selectedIds.includes(nikke.id)}
              />
            </Box>
          );
        })}
      </SimpleGrid>
      
      {visibleCount === 0 && (
        <Text color="gray.500" textAlign="center" py={8}>
          No characters found matching your criteria.
        </Text>
      )}
    </Box>
  );
};
