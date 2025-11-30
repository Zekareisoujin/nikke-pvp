// src/components/ApiImportModal.tsx
import { useState, useEffect } from 'react';
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
  Input,
  Text,
  Alert,
  AlertIcon,
  Progress,
} from '@chakra-ui/react';
import { parseFetchCommand } from '../utils/fetchParser';

/**
 * Modal that guides the user through the API import workflow using a serverless worker.
 * 1. User provides Worker URL (saved to localStorage).
 * 2. User pastes the fetch command.
 * 3. App parses headers/body and sends request to Worker.
 * 4. Worker proxies to game API and returns data.
 */
export const ApiImportModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [workerUrl, setWorkerUrl] = useState('');
  const [curl, setCurl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const toast = useToast();

  // Load worker URL from env or localStorage
  useEffect(() => {
    const envUrl = import.meta.env.VITE_WORKER_URL;
    const savedUrl = localStorage.getItem('nikke-worker-url');
    
    if (envUrl) {
      setWorkerUrl(envUrl);
    } else if (savedUrl) {
      setWorkerUrl(savedUrl);
    }
  }, []);

  // Save worker URL when it changes
  const handleWorkerUrlChange = (val: string) => {
    setWorkerUrl(val);
    localStorage.setItem('nikke-worker-url', val);
  };

  const handleImport = async () => {
    if (!workerUrl) {
      setError('Please enter your Worker URL.');
      return;
    }
    if (!curl) {
      setError('Please paste your fetch command.');
      return;
    }

    setIsLoading(true);
    setError('');
    setStatus('Parsing fetch command...');

    try {
      // 1. Parse the fetch command
      const parsed = parseFetchCommand(curl);
      
      const intlOpenId = parsed.body?.intl_open_id;
      const nikkeAreaId = parsed.body?.nikke_area_id;

      if (!intlOpenId || !nikkeAreaId) {
        throw new Error('Could not find intl_open_id or nikke_area_id in the pasted command.');
      }

      setStatus('Syncing data (this may take a few seconds)...');

      // Debug: Log the payload to be sent
      const payload = {
        intl_open_id: intlOpenId,
        nikke_area_id: nikkeAreaId,
        headers: parsed.headers,
        // name_codes is NOT sent; the worker will fetch the list itself
      };
      console.log('Sending payload to worker:', payload);

      // Check for critical headers
      const headerKeys = Object.keys(parsed.headers).map(k => k.toLowerCase());
      if (!headerKeys.includes('cookie')) {
        console.warn('Warning: No "cookie" header found in the parsed command.');
        toast({
          title: 'Potential Issue',
          description: 'No "cookie" header found in your command. The import might fail.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      }

      // 2. Send request to Worker
      const response = await fetch(workerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Worker error: ${response.status} ${errorText}`);
      }

      const data = await response.json();

      // 3. Validate response
      if (data.code !== 0) {
        throw new Error(`Game API Error: ${data.msg || 'Unknown error'}`);
      }

      // 4. Save data
      localStorage.setItem('nikke-api-import', JSON.stringify([data]));
      
      toast({
        title: 'Data imported successfully',
        description: `Imported data for ${data.data?.character_details?.length || 0} characters.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onClose();
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'An error occurred during import.');
    } finally {
      setIsLoading(false);
      setStatus('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Import Nikke Data (via Worker)</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Alert status="info" fontSize="sm">
              <AlertIcon />
              This feature requires a Cloudflare Worker to proxy requests to the game API.
            </Alert>

            <Box>
              <Heading size="sm" mb={2}>
                1. Worker URL
              </Heading>
              <Input
                placeholder="https://your-worker.subdomain.workers.dev"
                value={workerUrl}
                onChange={(e) => handleWorkerUrlChange(e.target.value)}
                isReadOnly={!!import.meta.env.VITE_WORKER_URL}
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                {import.meta.env.VITE_WORKER_URL 
                  ? "Configured via environment variable." 
                  : "The URL of your deployed Cloudflare Worker."}
              </Text>
            </Box>

            <Box>
              <Heading size="sm" mb={2}>
                2. Paste Fetch Command
              </Heading>
              <Text fontSize="xs" color="gray.600" mb={2}>
                Log in to the game on PC/Web, open DevTools (F12), go to Network tab, find a request (e.g. <b>GetUserCharacters</b> or GetUserCharacterDetails), right-click - Copy - Copy as fetch.
              </Text>
              <Textarea
                placeholder="fetch('https://api.blablalink.com/...', { ... })"
                value={curl}
                onChange={(e) => setCurl(e.target.value)}
                rows={8}
                fontSize="sm"
              />
            </Box>

            {error && (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            )}

            {isLoading && (
              <Box>
                <Text mb={2} fontSize="sm">{status}</Text>
                <Progress size="xs" isIndeterminate />
              </Box>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleImport} 
            isLoading={isLoading}
            loadingText="Importing"
          >
            Import Data
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
