import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  Stack,
  Radio,
  CloseButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Input, RankSelect, Select } from ".";

const AddSettingsModal = ({ parameters }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [values, setValues] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setError("");
    setLoading(true);
    if (Object.values(values).includes(""))
      return setError("Please fill in all fields.");
    parameters.onSubmit(values);
    setDefaultValues();
    setLoading(false);
    onClose();
  };

  const setDefaultValues = () => {
    for (const field of parameters.fields) {
      setValues((prevValues) => ({
        ...prevValues,
        [field.databaseName]: field.default || "",
      }));
    }
  };

  const handleChange = (value, databaseName) => {
    setValues((prevValues) => ({ ...prevValues, [databaseName]: value }));
  };

  const clearError = () => {
    setError("");
  };

  useEffect(() => {
    setDefaultValues();
  }, []);

  return (
    <>
      <Button onClick={onOpen} size="sm" colorScheme="blue">
        <AddIcon />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.900" color="white">
          <ModalHeader>Add {parameters.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {parameters.fields.map((field) => {
              switch (field.type) {
                case "text":
                  return (
                    <FormControl mb={2} id={field.id} isRequired>
                      <FormLabel>{field.name}</FormLabel>
                      <Input
                        type="Text"
                        value={values[field.databaseName]}
                        onChange={(e) =>
                          handleChange(e.target.value, field.databaseName)
                        }
                      />
                    </FormControl>
                  );
                case "select":
                  return (
                    <FormControl mb={2} id={field.id} isRequired>
                      <FormLabel>{field.name}</FormLabel>
                      <Select
                        placeholder={field.placeholder}
                        value={values[field.databaseName]}
                        onChange={(e) =>
                          handleChange(e.target.value, field.databaseName)
                        }
                      >
                        {field.options.map((option) => (
                          <option key={option.Id} value={option.name}>
                            {option.name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  );
                case "radio":
                  return (
                    <FormControl mb={2} id={field.id}>
                      <FormLabel>{field.name}</FormLabel>
                      <RadioGroup
                        onChange={(val) =>
                          handleChange(val, field.databaseName)
                        }
                        value={values[field.databaseName]}
                        defaultValue={field.default}
                      >
                        <Stack direction="row">
                          {field.values.map((value, i) => (
                            <Radio value={value} key={i}>
                              {value}
                            </Radio>
                          ))}
                        </Stack>
                      </RadioGroup>
                    </FormControl>
                  );
                case "rankSelect":
                  return (
                    <FormControl mb={2} id={field.id} isRequired>
                      <FormLabel>{field.name}</FormLabel>
                      <RankSelect
                        value={values[field.databaseName]}
                        placeholder="Select a rank"
                        onChange={(e) =>
                          handleChange(e.target.value, field.databaseName)
                        }
                      />
                    </FormControl>
                  );
              }
            })}
            {error && (
              <Alert status="error" variant="solid">
                <AlertIcon />
                <AlertTitle mr={2}>Error!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                <CloseButton
                  onClick={clearError}
                  position="absolute"
                  right="8px"
                  top="8px"
                />
              </Alert>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={loading}
              colorScheme="blue"
              mr={2}
              onClick={handleSubmit}
            >
              {loading ? <Spinner size="sm" /> : "Save"}
            </Button>
            <Button disabled={loading} colorScheme="red" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddSettingsModal;
