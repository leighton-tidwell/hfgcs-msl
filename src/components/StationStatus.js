import React, { useState } from "react";
import {
  Grid,
  GridItem,
  Text,
  Stack,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { Input } from ".";

const StationStatus = ({ station, handleStationChange }) => {
  const [formData, setFormData] = useState(station);

  console.log(formData);

  const handleChange = (e, name) => {
    const key = e?.target?.name || name;
    const value =
      e?.target?.value === "" || e?.target?.value ? e.target.value : e;

    console.log(key, value);
    setFormData((prevForm) => ({ ...prevForm, [key]: value }));
  };

  return (
    <Grid
      templateColumns="50px 75px"
      backgroundColor="#292c3c"
      border="1px solid #41445b"
      p={2}
      borderRadius="sm"
    >
      <GridItem display="flex" alignItems="center">
        <Text fontWeight="bold" fontSize="lg">
          {station.station}
        </Text>
      </GridItem>
      <GridItem>
        <Grid templateColumns="75px 125px 50px" columnGap={5} fontWeight="600">
          <GridItem>
            <Text>STRAT</Text>
          </GridItem>
          <GridItem>
            <Input
              size="xs"
              name="stratdesc"
              value={formData.stratdesc}
              type="text"
              onChange={(e) => handleChange(e)}
              onBlur={(e) => handleStationChange(formData.station, e)}
            />
          </GridItem>
          <GridItem>
            <RadioGroup
              name="stratcolor"
              onChange={(val) =>
                handleStationChange(station.station, val, "stratcolor")
              }
              value={station.stratcolor}
              height="100%"
            >
              <Stack direction="row" height="100%" alignItems="center">
                <Radio
                  value="green"
                  backgroundColor="green"
                  colorScheme="green"
                ></Radio>
                <Radio
                  value="amber"
                  backgroundColor="yellow"
                  colorScheme="yellow"
                ></Radio>
                <Radio
                  value="red"
                  backgroundColor="red"
                  colorScheme="red"
                ></Radio>
              </Stack>
            </RadioGroup>
          </GridItem>
          <GridItem>
            <Text>SCANS</Text>
          </GridItem>
          <GridItem>
            <Input
              name="scansdesc"
              size="xs"
              type="text"
              value={formData.scansdesc}
              onChange={(e) => handleChange(e)}
              onBlur={(e) => handleStationChange(formData.station, e)}
            />
          </GridItem>
          <GridItem>
            <RadioGroup
              name="scanscolor"
              onChange={(val) =>
                handleStationChange(station.station, val, "scanscolor")
              }
              value={station.scanscolor}
              height="100%"
            >
              <Stack direction="row" height="100%" alignItems="center">
                <Radio
                  value="green"
                  backgroundColor="green"
                  colorScheme="green"
                ></Radio>
                <Radio
                  value="amber"
                  backgroundColor="yellow"
                  colorScheme="yellow"
                ></Radio>
                <Radio
                  value="red"
                  backgroundColor="red"
                  colorScheme="red"
                ></Radio>
              </Stack>
            </RadioGroup>
          </GridItem>
          <GridItem>
            <Text>ALE</Text>
          </GridItem>
          <GridItem>
            <Input
              size="xs"
              name="aledesc"
              value={formData.aledesc}
              type="text"
              onChange={(e) => handleChange(e)}
              onBlur={(e) => handleStationChange(formData.station, e)}
            />
          </GridItem>
          <GridItem>
            <RadioGroup
              name="alecolor"
              onChange={(val) =>
                handleStationChange(station.station, val, "alecolor")
              }
              value={station.alecolor}
              height="100%"
            >
              <Stack direction="row" height="100%" alignItems="center">
                <Radio
                  value="green"
                  backgroundColor="green"
                  colorScheme="green"
                ></Radio>
                <Radio
                  value="red"
                  backgroundColor="red"
                  colorScheme="red"
                ></Radio>
              </Stack>
            </RadioGroup>
          </GridItem>
          <GridItem>
            <Text>DTMF</Text>
          </GridItem>
          <GridItem>
            <Input
              size="xs"
              type="text"
              name="dtmfdesc"
              value={formData.dtmfdesc}
              onChange={(e) => handleChange(e)}
              onBlur={(e) => handleStationChange(formData.station, e)}
            />
          </GridItem>
          <GridItem>
            <RadioGroup
              name="dtmfcolor"
              onChange={(val) =>
                handleStationChange(station.station, val, "dtmfcolor")
              }
              value={station.dtmfcolor}
              height="100%"
            >
              <Stack direction="row" height="100%" alignItems="center">
                <Radio
                  value="green"
                  backgroundColor="green"
                  colorScheme="green"
                ></Radio>
                <Radio
                  value="amber"
                  backgroundColor="yellow"
                  colorScheme="yellow"
                ></Radio>
                <Radio
                  value="red"
                  backgroundColor="red"
                  colorScheme="red"
                ></Radio>
              </Stack>
            </RadioGroup>
          </GridItem>
          <GridItem>
            <Text>Other</Text>
          </GridItem>
          <GridItem>
            <Input
              size="xs"
              name="otherdesc"
              value={formData.otherdesc}
              type="text"
              onChange={(e) => handleChange(e)}
              onBlur={(e) => handleStationChange(formData.station, e)}
            />
          </GridItem>
          <GridItem></GridItem>
        </Grid>
      </GridItem>
    </Grid>
  );
};

export default StationStatus;
