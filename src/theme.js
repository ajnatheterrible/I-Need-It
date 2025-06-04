import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  components: {
    Checkbox: {
      baseStyle: {
        control: {
          _disabled: {
            cursor: "default",
            opacity: 1,
          },
        },
        label: {
          _disabled: {
            cursor: "default",
          },
        },
        container: {
          _disabled: {
            cursor: "default",
            pointerEvents: "auto",
          },
        },
      },
    },
    Switch: {
      baseStyle: {
        track: {
          _disabled: {
            opacity: 1,
            cursor: "default",
          },
        },
        label: {
          _disabled: {
            cursor: "default",
          },
        },
        container: {
          _disabled: {
            cursor: "default",
            pointerEvents: "auto",
          },
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          _disabled: {
            opacity: 1,
            cursor: "default",
          },
        },
      },
    },
  },
});

export default theme;
