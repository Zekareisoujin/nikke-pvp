import { Box, Image, Text, VStack } from '@chakra-ui/react';
import type { Nikke } from '../types';

interface CharacterCardProps {
  nikke: Nikke;
  onClick: (nikke: Nikke) => void;
  isSelected?: boolean;
  hideIcons?: boolean;
}

const HexagonIcon = ({ src, alt }: { src?: string; alt: string }) => {
  if (!src) return null;
  return (
    <Box
      w="32px"
      h="36px"
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        clipPath:
          'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
      }}
      bg="gray.800"
    >
      <Box
        w="28px"
        h="32px"
        bg="gray.700"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          clipPath:
            'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        }}
      >
        <Image src={src} alt={alt} boxSize="20px" />
      </Box>
    </Box>
  );
};

export const CharacterCard = ({
  nikke,
  onClick,
  isSelected,
  hideIcons = false,
}: CharacterCardProps) => {
  const borderColor = isSelected ? 'blue.500' : 'transparent';

  return (
    <Box
      w="140px"
      h="220px"
      bg="white"
      cursor="pointer"
      onClick={() => onClick(nikke)}
      position="relative"
      transition="all 0.2s"
      _hover={{ transform: 'scale(1.05)' }}
      boxShadow={isSelected ? '0 0 0 3px #3182ce' : 'none'}
    >
      {/* Inner Content Container */}
      <Box
        w="100%"
        h="100%"
        position="relative"
        bg="gray.100"
        overflow="hidden"
      >
        {/* Character Portrait */}
        <Image
          src={nikke.imageUrl}
          alt={nikke.name}
          w="100%"
          h="100%"
          objectFit="cover"
          objectPosition="top center"
        />

        {/* Left Icon Stack */}
        {!hideIcons && (
          <VStack
            position="absolute"
            top="8px"
            left="4px"
            spacing={1}
            align="center"
            zIndex={2}
          >
            <HexagonIcon src={nikke.elementIcon} alt="element" />
            <HexagonIcon src={nikke.weaponIcon} alt="weapon" />
            <HexagonIcon src={nikke.burstIcon} alt="burst" />
          </VStack>
        )}

        {/* Bottom Section */}
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          h="60px"
          zIndex={2}
          pointerEvents="none"
        >
          {/* Angled Name Background Shape */}
          <Box
            position="absolute"
            bottom="8px"
            right="0"
            w="100%"
            h="45px"
            bg="rgba(0, 0, 0, 0.8)"
            sx={{
              clipPath: 'polygon(0% 30%, 100% 0%, 100% 100%, 0% 100%)',
            }}
          />

          {/* Content Container (No Clip Path) */}
          <Box
            position="absolute"
            bottom="0"
            right="0"
            w="100%"
            h="45px"
            display="flex"
            flexDirection="column"
            alignItems="flex-end"
            justifyContent="center"
            pr={2}
          >
            {/* Class Icon Watermark */}
            {nikke.classIcon && (
              <Image
                src={nikke.classIcon}
                alt="class"
                position="absolute"
                bottom="2px"
                right="2px"
                boxSize="60px"
                opacity={0.8}
                zIndex={0}
              />
            )}
            {/* Name */}
            <Box
              w="90%"
              overflow="hidden"
              position="relative"
              zIndex={1}
              mr="2px"
            >
              <Text
                color="white"
                fontSize="sm"
                fontWeight="bold"
                whiteSpace="nowrap"
                display="inline-block"
                float="left"
                sx={{
                  '@keyframes scrollText': {
                    '0%, 10%': { transform: 'translateX(0)' },
                    '50%': { transform: 'translateX(-100%)' },
                    '50.01%': { transform: 'translateX(100%)' },
                    '90%, 100%': { transform: 'translateX(0)' },
                  },
                  ...(nikke.name.length > 15 && {
                    animation: 'scrollText 10s linear infinite',
                  }),
                }}
              >
                {nikke.name}
              </Text>
            </Box>
          </Box>

          {/* Yellow Bottom Bar */}
          <Box
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            h="8px"
            bg="yellow.400"
          />
        </Box>
      </Box>
    </Box>
  );
};
