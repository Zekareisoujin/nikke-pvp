import {
  Box,
  Button,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tag,
  TagLabel,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import type { BurstType, ClassType, Element, WeaponType } from '../types';

export interface FilterState {
  elements: Element[];
  weapons: WeaponType[];
  classes: ClassType[];
  burstTypes: BurstType[];
  rarities: string[];
}

interface FilterPopoverProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
}

const FilterSection = ({ 
  title, 
  options, 
  selected, 
  onToggle, 
  colorScheme = 'gray' 
}: { 
  title: string; 
  options: string[]; 
  selected: string[]; 
  onToggle: (option: string) => void;
  colorScheme?: string;
}) => (
  <Box w="100%">
    <Text fontSize="sm" fontWeight="bold" mb={2} color="gray.400">
      {title}
    </Text>
    <HStack spacing={2} flexWrap="wrap">
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <Tag
            key={option}
            size="md"
            variant={isSelected ? 'solid' : 'outline'}
            colorScheme={isSelected ? colorScheme : 'gray'}
            cursor="pointer"
            onClick={() => onToggle(option)}
            mb={2}
            _hover={{ opacity: 0.8 }}
          >
            <TagLabel>{option}</TagLabel>
          </Tag>
        );
      })}
    </HStack>
  </Box>
);

export const FilterPopover = ({ filters, onFilterChange }: FilterPopoverProps) => {
  const bg = useColorModeValue('gray.800', 'gray.800');
  const borderColor = useColorModeValue('gray.700', 'gray.700');

  const toggleFilter = (category: keyof FilterState, value: string) => {
    const current = filters[category] as string[];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    
    onFilterChange({
      ...filters,
      [category]: updated,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      elements: [],
      weapons: [],
      classes: [],
      burstTypes: [],
      rarities: [],
    });
  };

  const activeFilterCount = Object.values(filters).reduce((acc, curr) => acc + curr.length, 0);

  return (
    <Popover placement="bottom-start" closeOnBlur={true}>
      <PopoverTrigger>
        <Button 
          rightIcon={<ChevronDownIcon />} 
          colorScheme="gray" 
          variant="outline"
          bg={activeFilterCount > 0 ? 'blue.900' : 'transparent'}
          borderColor={activeFilterCount > 0 ? 'blue.500' : 'gray.600'}
          _hover={{ bg: 'gray.700' }}
        >
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </Button>
      </PopoverTrigger>
      <PopoverContent bg={bg} borderColor={borderColor} w="400px" maxW="90vw">
        <PopoverHeader borderColor={borderColor} display="flex" justifyContent="space-between" alignItems="center">
          <Text fontWeight="bold" color="white">Filter Characters</Text>
          {activeFilterCount > 0 && (
            <Button size="xs" variant="ghost" colorScheme="red" onClick={clearFilters}>
              Clear All
            </Button>
          )}
        </PopoverHeader>
        <PopoverArrow bg={bg} />
        <PopoverCloseButton color="white" />
        <PopoverBody>
          <VStack spacing={4} align="stretch">
            <FilterSection
              title="Elements"
              options={['Fire', 'Water', 'Wind', 'Iron', 'Electric']}
              selected={filters.elements}
              onToggle={(val) => toggleFilter('elements', val)}
              colorScheme="red"
            />
            <FilterSection
              title="Weapons"
              options={['SG', 'SMG', 'AR', 'MG', 'SR', 'RL']}
              selected={filters.weapons}
              onToggle={(val) => toggleFilter('weapons', val)}
              colorScheme="blue"
            />
            <FilterSection
              title="Classes"
              options={['Attacker', 'Defender', 'Supporter']}
              selected={filters.classes}
              onToggle={(val) => toggleFilter('classes', val)}
              colorScheme="green"
            />
            <FilterSection
              title="Burst Types"
              options={['1', '2', '3']}
              selected={filters.burstTypes}
              onToggle={(val) => toggleFilter('burstTypes', val)}
              colorScheme="orange"
            />
            <FilterSection
              title="Rarity"
              options={['R', 'SR', 'SSR']}
              selected={filters.rarities}
              onToggle={(val) => toggleFilter('rarities', val)}
              colorScheme="yellow"
            />
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
