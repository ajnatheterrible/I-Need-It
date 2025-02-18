import {
  Menu,
  MenuButton,
  MenuList,
  Text,
  Icon,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

const CustomMenu = ({ placeholder, options, selected, onSelect }) => {
  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        width="100%"
        textAlign="left"
        bg="white"
        borderWidth="1px"
        borderColor="gray.200"
        _hover={{ borderColor: "gray.300" }}
        _expanded={{ bg: "gray.50" }}
        _focus={{ boxShadow: "outline" }}
        fontWeight="normal"
      >
        {selected || <Text color="gray.500">{placeholder}</Text>}
      </MenuButton>
      <MenuList>
        {options.map((option) =>
          option.name ? (
            <MenuItem key={option.name} onClick={() => onSelect(option.name)}>
              {<Icon as={option.icon} mr={2} />}
              {option.name}
            </MenuItem>
          ) : (
            <MenuItem key={option} onClick={() => onSelect(option)}>
              {option}
            </MenuItem>
          )
        )}
      </MenuList>
    </Menu>
  );
};

export default CustomMenu;
