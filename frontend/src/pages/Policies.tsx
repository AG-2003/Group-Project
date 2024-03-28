import { Link as RouterLink } from 'react-router-dom';
import {
  Flex,
  Button,
  Box,
  Heading,
  Text,
  VStack,
  useDisclosure,
  Collapse,
} from '@chakra-ui/react';
import policiesBG from '../assets/policiesBG.png';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box
      p={5}
      maxWidth="800px"
      margin="40px auto"
      backgroundColor="purple.100"
      borderRadius="8px"
      boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
      fontFamily="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      color="#333"
      transition="background-color 0.3s ease, transform 0.3s ease"
    >
      <Heading
        as="h1"
        size="xl"
        cursor="pointer"
        borderBottom="1px solid"
        borderColor={isOpen ? 'transparent' : 'purple.200'}
        mb={isOpen ? 0 : 5}
        mt={0}
        onClick={onToggle}
        color="#484c6c"
        _hover={{ color: '#363a53' }}
      >
        {title}
      </Heading>
      <Collapse in={isOpen}>
        <VStack align="start" spacing={4}>
          {children}
        </VStack>
      </Collapse>
    </Box>
  );
};

const Policies: React.FC = () => {
  return (
    <Flex direction="column" bgImage={policiesBG} bgPos='center' bgRepeat='no-repeat' bgSize='cover' bgAttachment='fixed' minH='100vh'>
      <RouterLink to="/">
        <Button mt={5} ml={5} variant="outline" colorScheme="purple" _hover={{ backgroundColor: 'purple.400', color: 'black' }}>
          Go back
        </Button>
      </RouterLink>

      <CollapsibleSection title="Privacy Policy">
        <Text>
          <Text as="span" fontWeight="semibold">At Joints</Text>, we respect your privacy and are committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you use Joints and our practices for collecting, using, maintaining, protecting, and disclosing that information.
        </Text>
        <Text>
          <Text as="span" fontWeight="semibold">Information We Collect</Text>: We collect several types of information from and about users of our App, including information by which you may be personally identified, such as name, postal address, email address, telephone number, and any other identifier by which you may be contacted online or offline.
        </Text>
        <Text>
          <Text as="span" fontWeight="semibold">How We Use Your Information</Text>: We use information that we collect about you or that you provide to us, including any personal information, to present our App and its contents to you, provide you with information, products, or services that you request from us, fulfill any other purpose for which you provide it, and carry out our obligations and enforce our rights arising from any contracts entered into between you and us.
        </Text>
      </CollapsibleSection>

      <CollapsibleSection title="Terms of Service">
        <Text>
          <Text as="span" fontWeight="semibold">Acceptance of the Terms</Text>: By accessing or using our App, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our App.
        </Text>
        <Text>
          <Text as="span" fontWeight="semibold">Use of the App</Text>: Joints grants you a personal, non-transferable, and non-exclusive right and license to use the resources of the App provided that you do not (and do not allow any third party to) copy, modify, create a derivative work of, reverse engineer, reverse assemble, or otherwise attempt to discover any source code of the App.
        </Text>
        <Text>
          <Text as="span" fontWeight="semibold">User Conduct</Text>: You agree not to use the App to: upload, post, email, or otherwise transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically, or otherwise objectionable.
        </Text>
      </CollapsibleSection>

      {/* Acceptable Use Policy Section */}
      <CollapsibleSection title="Acceptable Use Policy">
        <Text>
          <Text as="span" fontWeight="semibold">Prohibited Content</Text>: You may not post any content that is illegal, threatening, defamatory, obscene, or that infringes intellectual property rights.
        </Text>
        <Text>
          <Text as="span" fontWeight="semibold">System Abuse</Text>: Any unauthorized use of our system is a violation of these policies and certain federal and state laws, including the Computer Fraud and Abuse Act.
        </Text>
      </CollapsibleSection>

      {/* Intellectual Property Policy Section */}
      <CollapsibleSection title="Intellectual Property Policy">
        <Text>
          <Text as="span" fontWeight="semibold">Copyright</Text>: All content included on the App, such as text, graphics, logos, button icons, images, audio clips, digital downloads, and software, is the property of Joints or its content suppliers and protected by United States and international copyright laws.
        </Text>
        <Text>
          <Text as="span" fontWeight="semibold">Trademark</Text>: The Joints and other marks indicated on our App are registered trademarks of Joints. They may not be used in connection with any product or service that is not Joints's, in any manner that is likely to cause confusion among customers or in any manner that disparages or discredits Joints.
        </Text>
      </CollapsibleSection>

      {/* Community Guidelines Section */}
      <CollapsibleSection title="Community Guidelines">
        <Text>
          <Text as="span" fontWeight="semibold">Respect Each Other</Text>: Treat all members with respect and courtesy. Engage with others in a manner that is kind, constructive, and helpful.
        </Text>
        <Text>
          <Text as="span" fontWeight="semibold">No Harassment</Text>: Do not harass, threaten, or intimidate anyone. If someone chooses not to engage with you, respect their decision.
        </Text>
        <Text>
          <Text as="span" fontWeight="semibold">Illegal Behavior</Text>: Engaging in illegal activities or promoting illegal acts on our App is strictly prohibited.
        </Text>
        <Text>
          <Text as="span" fontWeight="semibold">Reporting Violations</Text>: If you see something that you think may violate our guidelines, please help us by using our tools to report it.
        </Text>
      </CollapsibleSection>

    </Flex>
  );
};

export default Policies;
