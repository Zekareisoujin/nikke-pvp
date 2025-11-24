import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  ChakraProvider,
  extendTheme,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
} from '@chakra-ui/react';
import type { Nikke } from './types';
import { allNikkes } from './data';
import { TeamDeck } from './components/TeamDeck';
import { CharacterPool } from './components/CharacterPool';
import { BurstStats } from './components/BurstStats';
import { useAutoUpdate } from './hooks/useAutoUpdate';
import { ApiImportModal } from './components/ApiImportModal';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});

const STORAGE_KEY = 'nikke-team-builder-selected-team';

function App() {
  // Persisted team state
  const [selectedTeam, setSelectedTeam] = useState<Nikke[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const teamIds = JSON.parse(saved) as string[];
        return teamIds
          .map(id => allNikkes.find(n => n.id === id))
          .filter((n): n is Nikke => n !== undefined);
      }
    } catch (error) {
      console.error('Failed to load team from localStorage:', error);
    }
    return [];
  });

  // Modal state for API import workflow
  const [isImportOpen, setIsImportOpen] = useState(false);
  const openImport = () => setIsImportOpen(true);
  const closeImport = () => setIsImportOpen(false);

  const { isUpdateAvailable, reload } = useAutoUpdate();

  // Save team changes
  useEffect(() => {
    try {
      const teamIds = selectedTeam.map(n => n.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(teamIds));
    } catch (error) {
      console.error('Failed to save team to localStorage:', error);
    }
  }, [selectedTeam]);

  const handleSelect = (nikke: Nikke) => {
    if (selectedTeam.find(n => n.id === nikke.id)) {
      setSelectedTeam(selectedTeam.filter(n => n.id !== nikke.id));
    } else if (selectedTeam.length < 5) {
      setSelectedTeam([...selectedTeam, nikke]);
    }
  };

  const handleRemove = (nikke: Nikke) => {
    setSelectedTeam(selectedTeam.filter(n => n.id !== nikke.id));
  };

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg="gray.900" py={8}>
        <Container maxW="container.xl">
          {isUpdateAvailable && (
            <Alert status="info" mb={4} borderRadius="md">
              <AlertIcon />
              <Box flex="1">
                <AlertTitle>New version available!</AlertTitle>
                <AlertDescription display="block">
                  A new version of the application is available.
                </AlertDescription>
              </Box>
              <Button colorScheme="blue" size="sm" onClick={reload} ml={4}>
                Refresh
              </Button>
            </Alert>
          )}
          <Heading color="white" mb={8} textAlign="center">
            Nikke Team Builder
          </Heading>
          {/* Import button */}
          <Button onClick={openImport} colorScheme="teal" mb={4}>
            Import from API
          </Button>
          <ApiImportModal isOpen={isImportOpen} onClose={closeImport} />

          <TeamDeck selectedTeam={selectedTeam} onRemove={handleRemove} />
          <BurstStats selectedTeam={selectedTeam} />
          <CharacterPool
            nikkes={allNikkes}
            onSelect={handleSelect}
            selectedIds={selectedTeam.map(n => n.id)}
          />
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
