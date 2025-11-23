import { useState } from 'react';
import { Box, Container, Heading, ChakraProvider, extendTheme } from '@chakra-ui/react';
import type { Nikke } from './types';
import { mockNikkes } from './data';
import { TeamDeck } from './components/TeamDeck';
import { CharacterPool } from './components/CharacterPool';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});

function App() {
  const [selectedTeam, setSelectedTeam] = useState<Nikke[]>([]);

  const handleSelect = (nikke: Nikke) => {
    if (selectedTeam.find((n) => n.id === nikke.id)) {
      // Deselect if already selected
      setSelectedTeam(selectedTeam.filter((n) => n.id !== nikke.id));
    } else {
      // Select if not full
      if (selectedTeam.length < 5) {
        setSelectedTeam([...selectedTeam, nikke]);
      }
    }
  };

  const handleRemove = (nikke: Nikke) => {
    setSelectedTeam(selectedTeam.filter((n) => n.id !== nikke.id));
  };

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg="gray.900" py={8}>
        <Container maxW="container.xl">
          <Heading color="white" mb={8} textAlign="center">Nikke Team Builder</Heading>
          
          <TeamDeck selectedTeam={selectedTeam} onRemove={handleRemove} />
          
          <CharacterPool 
            nikkes={mockNikkes} 
            onSelect={handleSelect} 
            selectedIds={selectedTeam.map(n => n.id)} 
          />
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
