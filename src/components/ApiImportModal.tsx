// src/components/ApiImportModal.tsx
import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  VStack,
  Heading,
  Box,
  useToast,
} from '@chakra-ui/react';
import { parseFetchCommand } from '../utils/fetchParser';
import { generateFetchScript } from '../utils/scriptGenerator';
import characterMetadata from '../data/character_metadata.json';

/**
 * Simple modal that guides the user through the 3‑step API import workflow:
 *   1. Paste the fetch command they copied from the game site.
 *   2. Generate a browser‑console script that fetches *all* characters.
 *   3. Paste the JSON response back into the modal.
 */
export const ApiImportModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [curl, setCurl] = useState('');
  const [script, setScript] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const toast = useToast();

  // All name_codes from the static metadata file
  const allCodes: number[] = Object.keys(characterMetadata).map(k => Number(k));

  const handleGenerate = () => { 
    try {
      const parsed = parseFetchCommand(curl);
      const generated = generateFetchScript(parsed, allCodes);
      setScript(generated);
      setError('');
    } catch (e) {
      setError('Failed to parse cURL – please check the format.');
    }
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(response);
      // For now we just store it in localStorage – later the app can consume it.
      localStorage.setItem('nikke-api-import', JSON.stringify(data));
      toast({
        title: 'Data imported',
        description: `Imported ${data.length} batches of character data.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setError('');
      onClose();
    } catch (e) {
      setError('Invalid JSON – please paste the exact output from the script.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Import Nikke Character Data (Manual API)</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Box>
              <Heading size="sm" mb={2}>1️⃣ Paste your fetch command</Heading>
              <Textarea
                placeholder="fetch('https://api.blablalink.com/...'"
                value={curl}
                onChange={e => setCurl(e.target.value)}
                rows={6}
              />
              <Button mt={2} onClick={handleGenerate} colorScheme="teal">
                Generate Browser Script
              </Button>
            </Box>

            {script && (
              <Box>
                <Heading size="sm" mb={2}>2️⃣ Run this script in the console on blablalink.com</Heading>
                <Textarea value={script} isReadOnly rows={12} />
                <Button
                  mt={2}
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(script)}
                >
                  Copy to clipboard
                </Button>
              </Box>
            )}

            {script && (
              <Box>
                <Heading size="sm" mb={2}>3️⃣ Paste the JSON response here</Heading>
                <Textarea
                  placeholder="Paste the whole JSON output from the script"
                  value={response}
                  onChange={e => setResponse(e.target.value)}
                  rows={8}
                />
                <Button mt={2} onClick={handleImport} colorScheme="blue">
                  Import Data
                </Button>
              </Box>
            )}

            {error && <Box color="red.500">{error}</Box>}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
