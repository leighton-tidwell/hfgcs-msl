import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Link,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import {
  SettingsIcon,
  MainSettings,
  PersonnelSettings,
  LinkSettings,
  EAMSettings,
  FOXSettings,
} from ".";

const SettingsModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Link onClick={onOpen}>
        <SettingsIcon />
      </Link>
      <Modal scrollBehavior="inside" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="90rem" height="45rem" bg="gray.900" color="white">
          <ModalHeader>Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs border="0" variant="enclosed">
              <TabList>
                <Tab>Main</Tab>
                <Tab>Personnel</Tab>
                <Tab>Links</Tab>
                <Tab>EB:EAM</Tab>
                <Tab>EB:FOX</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <MainSettings />
                </TabPanel>
                <TabPanel>
                  <PersonnelSettings />
                </TabPanel>
                <TabPanel>
                  <LinkSettings />
                </TabPanel>
                <TabPanel>
                  <EAMSettings />
                </TabPanel>
                <TabPanel>
                  <FOXSettings />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SettingsModal;
