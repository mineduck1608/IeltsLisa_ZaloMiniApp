import React, { FC } from "react";
import { Box, Header, Text } from "zmp-ui";
import logo from "static/logo.png";
import { getConfig } from "utils/config";


interface WelcomeProps {
  title: string ; // Định nghĩa kiểu phù hợp
}

export const Welcome: FC<WelcomeProps> =  ({ title }) => {
  return (
    <Header
      className="app-header no-border pl-4 flex-none"
      showBackIcon={false}
      title={
        (
          <Box flex alignItems="center" className="space-x-2">
            <img
              className="w-8 h-8 rounded-lg border-inset"
              src={getConfig((c) => c.template.headerLogo) || logo}
            />
            <Box>
              <Text.Title size="small">{title}</Text.Title>
            </Box>
          </Box>
        ) as unknown as string
      }
    />
  );
};
